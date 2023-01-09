import { randomUUID } from "crypto";
import { ExpressType, cache } from "..";
import { User } from "../types";
import { validateSchema } from "./schemas";


export const createUserRoutes = (app: ExpressType) => {
  app.post("/user/", validateSchema, (req, res) => {
    const user = req.body;
    
    user.id = randomUUID();
    user.isDeleted = false;

    const oldUsers = cache.get<User[]>("users") || [];
    const newUsers = [...oldUsers, user];

    cache.set("users", newUsers);
  });
};