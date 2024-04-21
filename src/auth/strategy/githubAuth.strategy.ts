import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Profile, Strategy } from 'passport-github2';
import { Providers } from '@prisma/client';

import { AuthService } from '../auth.service';

@Injectable()
export class GithubAuthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    public configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
      callbackURL:
        configService.get('NODE_ENV') === 'development'
          ? configService.get('GITHUB_CALLBACK_URL_DEVELOPMENT')
          : configService.get('GITHUB_CALLBACK_URL_PRODUCTION'),
      scope: ['user:email', 'public_profile'],
    });
  }

  public async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<any> {
    try {
      const { provider, displayName, emails, photos } = profile;

      const userData = {
        name: displayName,
        email: emails[0].value,
        image: photos[0].value,
      };

      const user = await this.authService.getOrCreateUserAccount(
        userData,
        provider as Providers,
      );

      done(null, user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
