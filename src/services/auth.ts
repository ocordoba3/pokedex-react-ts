import { useMutation } from "@tanstack/react-query";
import { api, setAuthToken } from "./api";

export type LoginResponse = {
  token: string;
  [key: string]: unknown;
};

export type LoginVariables = {
  username: string;
  password: string;
};

export async function loginRequest(
  username: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/login", {
    username,
    password,
  });

  return data;
}

export function useLoginMutation() {
  return useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: ({ username, password }) => loginRequest(username, password),
    onSuccess: (data) => {
      if (data.token) {
        setAuthToken(data.token);
      } else {
        setAuthToken(null);
      }
    },
  });
}
