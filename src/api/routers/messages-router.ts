import { Express, Router, Request, Response } from "express";
import { MessagesController } from "../../bl/messages-controller";
import { Message } from "../../storage/entities/message";

export class MessagesRouter {
  public static run(app: Express): void {
    var router: Router = Router();
    var controller: MessagesController = new MessagesController();

    // Create a new message
    router.post("/", (req: Request, res: Response) => {
      if (req.body.type) {
        res.sendStatus(400);
        return;
      }
      if (!req.body.payload) {
        res.sendStatus(400);
        return;
      }
      const message = new Message();
      message.payload = req.body.payload;
      res.json(controller.create(message));
    });

    // Retrieve all messages
    router.get('/', (req: Request, res: Response) => {
      res.json(controller.getAll());
    });
   
    // Retrieve a single message with id
    router.get('/:id', (req: Request, res: Response) => {
      res.json(controller.get(parseInt(req.params.id)));
    });    

    // Update a single message with id
    router.put("/:id", (req: Request, res: Response) => {
      if (req.body.type) {
        res.sendStatus(400);
        return;
      }
      if (!req.body.payload) {
        res.sendStatus(400);
        return;
      }      
      let message = new Message();
      message.payload = req.body.payload;
      res.json(controller.update(parseInt(req.params.id), message));
    });  

    // Delete a single message with id
    router.delete("/:id", (req: Request, res: Response) => {
      res.json(controller.delete(parseInt(req.params.id)));
    });  
   
    app.use("/api/messages", router);
  }
}
