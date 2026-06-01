import type { Token } from "@/api/types/auth.types";
import type { UserResponse } from "@/api/types/user.types";
import { mockUser } from "./user.mock";

export const mockToken: Token = {
  access_token: "mock_jwt_token_" + Date.now(),
  token_type: "bearer",
};

export const mockLoginResponse = {
  token: mockToken,
  user: mockUser,
};

export const mockRegisterUser: UserResponse = {
  id: 2,
  username: "new_user",
  email: "new@example.com",
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  roles: [],
  profile: undefined,
};
