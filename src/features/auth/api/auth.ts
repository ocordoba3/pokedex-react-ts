import { useMutation } from "@tanstack/react-query";

import { api, setAuthToken } from "../../../app/api";
import type { LoginResponse, LoginBody } from "../interfaces/auth.interface";

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
  return useMutation<LoginResponse, Error, LoginBody>({
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
