import { Account, User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User & {
    accounts?: Account[];
  };
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  image: string;
}

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
