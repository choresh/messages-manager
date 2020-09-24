import "reflect-metadata";
import { createConnection, Connection, ConnectionOptions } from "typeorm";

export class Db {
  private static _cnnection: Connection;

  public static async run(): Promise<void> {
    const options: ConnectionOptions = {
      type: "postgres",
      host: process.env.PG_HOST || "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "messages-manager",
      synchronize: true,
      dropSchema: true,
      logging: false,
      entities: [
        "build/storage/entities/*.js"
      ]      
    };
    return createConnection(options)
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
