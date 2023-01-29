import { DataTypes, Sequelize } from "sequelize";
import { DBTables } from "../../types";
import { createMockUserInDB } from "../../scripts/initDb";

export const userModel = async (sequelize: Sequelize) => {
	const Users = sequelize.define(DBTables.users, {
		id: {
      primaryKey: true,
      type: DataTypes.STRING
    },
		login: DataTypes.STRING,
		password: DataTypes.STRING,
		age: DataTypes.INTEGER,
		isDeleted: DataTypes.BOOLEAN,
	});

  await Users.sequelize?.sync({ force: true });

  const { count } = await Users.findAndCountAll();
  console.log("SEQUELZIE COUNT", count);
  
  if (count === 0) {
    createMockUserInDB(sequelize);
  }

  return Users;
};
