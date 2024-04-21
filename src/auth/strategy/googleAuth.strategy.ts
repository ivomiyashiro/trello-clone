import { PassportStrategy } from '@nestjs/passport';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AuthService } from '../auth.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    public configService: ConfigService,
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

      const userData = {
        name,
        email,
        image: picture,
      };

      const user = await this.authService.getOrCreateUserAccount(
        userData,
        provider,
      );

      return done(null, user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
