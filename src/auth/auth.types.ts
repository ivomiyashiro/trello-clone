export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  image: string;
}

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
