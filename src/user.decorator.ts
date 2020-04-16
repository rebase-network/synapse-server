import { createParamDecorator } from '@nestjs/common';

export interface User { id: string; }

export const User = createParamDecorator((data, req) => {
  const user = req.user as User;
  return user;
});