import { Sequelize } from "sequelize";


const mockUserData = [
  {
    id: "1",
    login: "foo",
    password: "123qweASD",
    age: 10,
    isDeleted: false,
  },
  {
    id: "2",
    login: "bar",
    password: "123qweASD",
    age: 11,
    isDeleted: false,
  },
  {
    id: "3",
    login: "foobar",
    password: "123qweASD",
    age: 12,
    isDeleted: false,
  },
];

export const createMockUserInDB = (sequelize: Sequelize) => {
  mockUserData.forEach(async (user) => {
    await sequelize.models.Users.create(user);
  });
};