export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T; // Chỉ có khi thành công
  errors?: string;
  // errors?: { field: string; message: string[] }[]; // Chỉ có khi thất bại
}
export type LoginResponse = ApiResponse<{
  user: UserResponse;
  access_token: string;
}>;
