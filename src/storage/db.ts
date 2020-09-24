import "reflect-metadata";
import { createConnection, Connection, ConnectionOptions } from "typeorm";

export class Db {
  private static _connection: Connection;

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
    // Do some attempts to connect to the postgress DB (need to wait until the service
    // is up, if entire creation of the services done via 'docker-compose.yml').
    for (var i = 0; ; i++) {
      try {
        console.log("Connect to postgress DB started, attempt " + (i + 1) + "/10");
        this._connection = await createConnection(options);
        console.log("Connect to postgress DB ended");
        break;
      } catch (err) {
        if ( i === 9) {
          console.log("Connect to postgress DB failed, error:", err);
          return Promise.reject(err);
        }
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });  
      }             
    } 
  }

  public static getConnection(): Connection {
    if (!this._connection) {
      throw new Error("DB not initialized yet");
    }
    return this._connection;
  }
}
