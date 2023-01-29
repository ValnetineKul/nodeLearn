import { Sequelize } from "sequelize";
import { userModel } from "./models/user.model";

export const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "postgres://vtpxgyuy:ZfypGo1O8U0vOoDLuiWvaB2TePnSzrQj@snuffleupagus.db.elephantsql.com/vtpxgyuy",
	logQueryParameters: true,
	benchmark: true
});

const modelDefiners = [
	userModel,
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}
