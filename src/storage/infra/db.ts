import "reflect-metadata";
import { createConnection, Connection, ConnectionOptions } from "typeorm";

const CONNECTION_RETRY_COUNT: number = 10;
const CONNECTION_RETRY_TIMEOUT_MS: number = 2000;

export class Db {
  private static _connection: Connection;

  public static async run(): Promise<void> {
    this._connection = await this.connect();   
  }

  public static getConnection(): Connection {
    if (!this._connection) {
      throw new Error("DB not initialized yet");
    }
    return this._connection;
  }

  private static async connect(): Promise<Connection> {

    // Env variable 'PG_HOST' defined in 'docker-compose.yml', the 'localhost' will
    // be selected if run performed without the 'docker-compose.yml' (e.g. while
    // developer runs the service locally, out of docker macine).
    let host: string = process.env.PG_HOST || "localhost";
    
    // TODO: currently most of the values are hard-coded - this it temp solution, a
    // beter one will be to pass them as env variables (especially - the password!).
    const options: ConnectionOptions = {
      type: "postgres",
      host: host,
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

    return new Promise(async (resolve, reject)  => {
      // * Do some attempts to connect to the postgress DB (in some cases need to
      //   wait until the postgress DB is up, e.g. if entire creation of the services
      //   done via 'docker-compose.yml').
      // * TODO: this is temp solution, a better one will be to solve the synchronization
      //   issue at the deployment mechanizem (i.e. at 'dockerfile' and/or 'docker-compose.yml'
      //   files).
      for (var i = 1; ; i++) {
        try {
          console.log("Connect to postgress DB started, attempt " + i + "/" + CONNECTION_RETRY_COUNT);
          let connection: Connection = await createConnection(options);
          console.log("Connect to postgress DB ended");
          resolve(connection);
          return;
        } catch (err) {
          console.log("MESSAGE:", err.message)
          var isConnectionFailure: boolean = (err.message && ((<string>err.message).startsWith("connect ECONNREFUSED") || (err.message === "the database system is starting up")));
          if ((i === CONNECTION_RETRY_COUNT) || !isConnectionFailure) {
            console.log("Connect to postgress DB failed, error:", err);
            reject("Connect to postgress DB failed, reason: " + err.message);
            return;
          }
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, CONNECTION_RETRY_TIMEOUT_MS);
          });  
        }             
      } 
    });
  }
}
