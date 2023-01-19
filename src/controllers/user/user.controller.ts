import { randomUUID } from "crypto";
import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "../../interfaces";
import { Routes, User, GetUserReqData } from "../../types";
import { validateSchema } from "../../utils";
import userSchema from "./user.schema";
import { json } from "body-parser";

class UserController implements Controller {
  public path = Routes.user;
  public router = Router();

  private users: User[] = [];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.post(this.path, validateSchema(userSchema.userSchemaPost), this.createUser);
    this.router.patch(`${this.path}/:id`, validateSchema(userSchema.userSchemaPatch), this.updateUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
    this.router.param("id", this.getIndexById);
  }
  
  getIndexById = (request: Request, response: Response , next: NextFunction, id: string) => {
    const userIndex = this.users?.findIndex((user) => id === user.id);
    if (userIndex === -1) {
      response.status(404).json({
        message: `User with id ${id} not found!`
      });
    } else {
      request.params.userIndex = String(userIndex);
      next();
    }
  };

  getUserById = (request: Request, response: Response) => {
    response.send(this.users[Number(request.params.userIndex)]);
  };

  updateUser = (request: Request, response: Response) => {
    const users = [...this.users];

    const userToUpdateIndex = Number(request.params.userIndex);

    delete request.body.userIndex;

    const updatedUserData = request.body;
      users[userToUpdateIndex] = {
        ...users[userToUpdateIndex],
        ...updatedUserData,
      };
  
      this.users = users;

      response.status(200).json({
        message: `User ${request.params.id} is updated`,
        user: users[userToUpdateIndex],
      });
  };

  deleteUser = (request: Request, response: Response) => {
    const users = [...this.users];
    const userToDeleteIndex = Number(request.params.userIndex);

    users[userToDeleteIndex].isDeleted = true;

    this.users = users;

    response.status(200).json({
      message: `user ${request.params.id} deleted`,
      user: users[userToDeleteIndex],
    });
  };
 
  getAllUsers = (request: Request, response: Response) => {
    if (!this.users.length) {
      response.send({
        message: "No users added",
      });
    }
    
    const reqData: GetUserReqData = request.body;

    let users = [...this.users];
    
    if (reqData.substring) {
      const regexp = new RegExp(reqData.substring?.toLocaleLowerCase(), "ig");
      users = users?.filter(({ login }) => login.match(regexp));
    }

    if (reqData.limit) {
      users = users?.slice(0, reqData.limit);
  }

    response.send(users);
  };
 
  createUser = (request: Request, response: Response) => {
    const user: User = request.body;
    user.id = randomUUID();
    this.users.push(user);

    response.send({
      message: `User ${user.login} created`,
      user,
    });
  };
}

export default UserController;