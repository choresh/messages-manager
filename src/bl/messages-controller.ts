import { Repository } from "typeorm";
import { Message, MessageType } from "../storage/entities/message";
import { Db } from "../storage/db";

export class MessagesController {
  private _repository: Repository<Message>;
 
  public constructor() {
    this._repository = Db.getConnection().getRepository(Message);
  }

  public async create(message: Message): Promise<Message> {
    return await this._repository.save(message);
  }

  public async getAll(): Promise<Message[]> {
      return await this._repository.find();           
  }

  public async get(id: number): Promise<Message> {
      return await this._repository.findOne(id);           
  }

  public async update(id: number, message: Message): Promise<Message> {
    let entityToUpdate = await this._repository.findOne(id);
    entityToUpdate.type = message.type;
    return await this._repository.save(entityToUpdate);
  }

  public async delete(id: number): Promise<Message> {
    let entityToRemove = await this._repository.findOne(id); 
    return await this._repository.remove(entityToRemove);
  }          
}
