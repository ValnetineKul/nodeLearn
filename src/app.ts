import express, { Application } from "express";
import { Controller } from "./interfaces";
import bodyParser from "body-parser";
import { Routes } from "./types";

class App {
  public app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    // this.initializeErrorHandling();
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
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