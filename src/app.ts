import { Server } from "./api/server";
import { Db } from "./storage/db";

class App {
  public static run(): void {
    Db.run()
      .then(() => {
        return Server.run();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
App.run();
