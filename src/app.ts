import express, { Application } from "express";
import { Controller } from "./interfaces";
import bodyParser from "body-parser";
import { Routes } from "./types";
import { sequelize } from "./sequelize";

class App {
  public app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    // this.initializeErrorHandling();
  }

  public listen(port: number) {
    this.app.listen(port, async () => {
      console.log(`App listening on the port ${port}`);

      try {
        await sequelize.authenticate();
        
        console.log("DB SUCCESS");
      } catch (error) {
        console.log("DB ERROR");
      }
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  // private initializeErrorHandling() {
  // }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(Routes.root, controller.router);
    });
  }
}

export default App;