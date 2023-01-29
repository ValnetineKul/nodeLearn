import { randomUUID } from "crypto";
import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "../../interfaces";
import { Routes, User, GetUserReqData, DBTables } from "../../types";
import { validateSchema } from "../../utils";
import userSchema from "./user.schema";
import { sequelize } from "../../sequelize";
import { Op } from "sequelize";

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
  }

  getUserById = async(request: Request, response: Response) => {
    const id = request.params.id;
    const user = await sequelize.models[DBTables.users].findOne({
      where: { id }
    });
    response.send(user);
  };

  updateUser = async (request: Request, response: Response) => {
    const updatedUserDto = request.body;
    const id = request.params.id;
    await sequelize.models[DBTables.users].update(updatedUserDto, {
      where: { id },
      returning: true,
    });


    response.status(200).json({
      message: `User ${request.params.id} is updated`,
    });
  };

  deleteUser = async (request: Request, response: Response) => {
    const id = request.params.id;
    await sequelize.models[DBTables.users].update(
      { isDeleted: true },
      {
        where: { id },
        returning: true,
      });

    response.status(200).json({
      message: `user ${request.params.id} deleted`,
    });
  };

  getAllUsers = async (request: Request, response: Response) => {
    const reqData: GetUserReqData = request.body;
    const stringForRegexpCheck = reqData.substring || "";

    const rows = await sequelize.models[DBTables.users].findAll({
      limit: reqData.limit,
      where: {
        login: {
          [Op.substring]: stringForRegexpCheck,
        },
      }
    });
    
    response.send({
      users: rows,
    });
  };
 
  createUser = async (request: Request, response: Response) => {
    const userDto: User = request.body;
    userDto.id = randomUUID();
    
    await sequelize.models[DBTables.users].create(userDto);

    response.send({
      message: `User ${userDto.login} created`,
      user: userDto,
    });
  };
}

export default UserController;