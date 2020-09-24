import { Repository } from "typeorm";
import { Message, MessageType } from "../storage/entities/message";
import { Db } from "../storage/db";
import { MessagesProcessor } from "./messages-processor";

export class MessagesController {
  private _repository: Repository<Message>;
  private _messagesProcessor: MessagesProcessor;
 
  public constructor() {
    this._repository = Db.getConnection().getRepository(Message);
    this._messagesProcessor = new MessagesProcessor();
  }

  public async create(message: Message): Promise<Message> {
    let createdEentity: Message = await this._repository.save(message);
    
    // * Calculate and update the message type.
    // * This operation done in background thread, i.e. in async manner, without locking of the current thread.
    // * If any attempt to fetch current message will be performed BEFORE complition of the operation - the
    //   result will be with 'null' value at field 'type'.  
    this.dealWithMessageType(message);
    
    return createdEentity;
  }

  public async update(id: number, message: Message): Promise<Message> {    
    let entityToUpdate: Message = await this._repository.findOne(id);
    entityToUpdate.payload = message.payload;
    entityToUpdate.type = undefined;
    let updatedEntity: Message = await this._repository.save(entityToUpdate);
    
    // * Calculate and update the message type.
    // * This operation done in background thread, i.e. in async manner, without locking of the current thread.
    // * If any attempt to fetch current message will be performed BEFORE complition of the operation - the
    //   result will be with 'null' value at field 'type'.  
    this.dealWithMessageType(message);
 
    return updatedEntity;
  }

  public async getAll(): Promise<Message[]> {
      return await this._repository.find();           
  }

  public async get(id: number): Promise<Message> {
      return await this._repository.findOne(id);           
  }  

  public async delete(id: number): Promise<Message> {
    let entityToRemove: Message = await this._repository.findOne(id); 
    return await this._repository.remove(entityToRemove);
  }
  
  private async updateMessageType(id: number, messageType: MessageType): Promise<Message> {
    let entityToUpdate: Message = await this._repository.findOne(id);
    entityToUpdate.type = messageType;
    return await this._repository.save(entityToUpdate);
  }

  private dealWithMessageType(message: Message): void {
    
    // * Calculate the message type.
    // * This operation done in background thread, i.e. in async manner, without locking of the current thread.
    this._messagesProcessor.processAsync(message.payload)
      .then((messageType: MessageType) => {
        
        // Update the message type in DB.
        return this.updateMessageType(message.id, messageType);
      })
      .catch((err) => {
        console.error(err);
      });

    // Exit the method WITHUOT waiting for completion of the async operation.
  }
}
