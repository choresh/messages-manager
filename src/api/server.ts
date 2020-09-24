import express, { Express } from "express";
import { json } from "body-parser";
import console from "console";
import expressPromise from "express-promise";
import { MessagesRouter } from "./routers/messages-router";

const PORT = 8080;

export class Server {
  private static _app: Express = express();

  public static async run(): Promise<void> {

    // Parse requests of content-type - application/json
    this._app.use(json());
  
    // Enable easy conversion from 'Promise' to express midleware
    this._app.use(expressPromise());

    // Attach routers (cuurently - only one)
    MessagesRouter.run(this._app);
    
    // Start listen for requests
    return new Promise((resolve, reject) => {
      this._app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
        resolve();
      });
    });
  }
}
