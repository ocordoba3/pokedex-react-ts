export type LoginResponse = {
  token: string;
  [key: string]: unknown;
};

export type LoginBody = {
  username: string;
  password: string;
};

export type ErrorResp = {
  response: {
    data: {
      message: string;
    };
  };
};
