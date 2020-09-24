import "reflect-metadata";
import { createConnection, Connection } from "typeorm";

export class Db {
  private static _cnnection: Connection;

  public static async run(): Promise<void> {
    return createConnection()
      .then(async (connection: Connection) => {
        this._cnnection = connection;        
      })
      .catch((err) => {
        console.error(err);
      });
  }

  
  public static getConnection(): Connection {
    if (!this._cnnection) {
      throw new Error("DB not initialized yet");
    }
    return this._cnnection;
  }
}
