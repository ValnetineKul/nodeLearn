import express from "express";
import NodeCache from "node-cache";
import { randomUUID } from "crypto";
import { userSchema } from "./routes/schemas";
import { User } from "./types";
import BodyParser from "body-parser";
import { validateSchema } from "./utils";


export type ExpressType = typeof app;

const app = express();
const port = 3001;

export const cache = new NodeCache();

app.use(BodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
let mockId = 1;
app.post("/user", validateSchema(userSchema), (req, res) => {
  const user = req.body;  
  
  user.isDeleted = false;
  user.id = String(mockId);
  mockId++;

  const oldUsers = cache.get<User[]>("users") || [];

  const newUsers = [...oldUsers, user];

  cache.set("users", newUsers);

  res.status(200).json({
    message: "user added"
  });
});

app.get("/user", (_, res) => {
  const users = cache.get("users");
  res.status(200).json(users);
});

app.get("/user/:id", (req, res) => {
  const users = cache.get<User[]>("users");

  const user = users?.find(({ id }) => req.params.id === id);

  if (user === undefined) {
    res.status(404).json({
      message: `User with id ${req.params.id} not found`
    });
  } else {
    res.status(200).json(user);
  }
});

app.patch("/user/:id", (req, res) => {
  const users = cache.get<User[]>("users");

  const userToUpdateIndex = users?.findIndex(({ id }) => req.params.id === id);

  if (!users || userToUpdateIndex === undefined || userToUpdateIndex === -1) {
    res.status(404).json({
      message: `User with id ${req.params.id} not found`
    });
  } else {
    const updatedUserData = req.body;
    users[userToUpdateIndex] = {
      ...users[userToUpdateIndex],
      ...updatedUserData,
    };

    cache.set("users", users);
    res.status(200).json({
      message: `User ${req.params.id} is updated`,
      user: users[userToUpdateIndex],
    });
  }
});

app.delete("/user", (req, res) => {
  const id: User["id"] = req.body.id;
  const users = cache.get<User[]>("users");
  const userToDeleteIndex = users?.findIndex((user) => user.id === id);

  if (users === undefined || userToDeleteIndex === undefined || userToDeleteIndex === -1) {
    res.status(404).json({
      message: `User with id ${id} not found`
    });
  } else {
    users[userToDeleteIndex].isDeleted = true;

    cache.set("users", users);

    res.status(200).json({
      message: `user ${id} deleted`,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});