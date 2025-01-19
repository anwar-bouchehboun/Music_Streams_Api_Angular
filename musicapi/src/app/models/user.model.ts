export interface User {
  id?: number;
  login: string;
  password: string;
  roleRequests?: RoleRequest[];
}

export interface RoleRequest {
  rolename: string;
}
