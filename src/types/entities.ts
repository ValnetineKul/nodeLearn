export type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

export type GetUserReqData = {
  limit?: number;
  substring?: string;
}