

import App from "./app";
import { UserController } from "./controllers";

const port = 3001;

const app = new App(
  [
    new UserController(),
  ],
);

app.listen(port);