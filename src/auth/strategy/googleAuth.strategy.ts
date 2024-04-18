import { PassportStrategy } from '@nestjs/passport';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from 'src/lib/prisma/prisma.service';
import { generarPassword } from 'src/lib/utils/generatePassword';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    public configService: ConfigService,
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL:
        configService.get('NODE_ENV') === 'development'
          ? configService.get('GOOGLE_CALLBACK_URL_DEVELOPMENT')
          : configService.get('GOOGLE_CALLBACK_URL_DEVELOPMENT'),
      scope: ['email', 'profile'],
    });
  }

  public async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { provider, _json } = profile;
      const { name, email, picture } = _json;

      const googleProvider = await this.authService.getOrCreateAuthProvider(
        provider,
      );

      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
        include: {
          accounts: true,
        },
      });

      // Check if user has google account created.
      if (user) {
        await this.authService.getOrCreateUserAccount(user, googleProvider);
        return done(null, user);
      }

      // Creates the new user with his google account.
      const newUser = await this.authService.createUserAndAccount({
        name,
        email,
        image: picture,
        password: await bcrypt.hash(generarPassword(), 10),
        accountProviderId: googleProvider.id,
      });

      done(null, newUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
