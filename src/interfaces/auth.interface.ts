export type LoginResponse = {
  token: string;
  [key: string]: unknown;
};

export type LoginBody = {
  username: string;
  password: string;
};
