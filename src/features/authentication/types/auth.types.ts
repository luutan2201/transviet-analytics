import { z } from "zod";

export const loginRequestSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export interface LoginResponse {
  readonly success: boolean;
  readonly message?: string;
  readonly username?: string;
}

export interface CurrentUser {
  readonly username: string;
}
