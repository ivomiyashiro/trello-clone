import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import { PORT } from '../src/main';
import { PrismaService } from '../src/lib/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { SignupDto } from '../src/modules/auth/dtos';

const BASE_URL = `http://localhost:${PORT}/api`;

describe('e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.enableCors({
      credentials: true,
      origin: [BASE_URL],
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();

    pactum.request.setBaseUrl(BASE_URL);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: SignupDto = {
      name: 'e2e',
      email: 'test@user.com',
      password: 'testinguser',
    };

    describe('Signup', () => {
      it('should throw an error if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({ email: 'email@wrong.com' })
          .expectStatus(400);
      });

      it('should throw an error if name is empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            email: dto.email,
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            name: dto.name,
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            name: dto.name,
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('should throw an error if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/local/login')
          .withBody({ email: 'email@wrong.com' })
          .expectStatus(400);
      });

      it('should throw an error if email is not correct', () => {
        return pactum
          .spec()
          .post('/auth/local/login')
          .withBody({
            email: dto.email,
            password: 'wrongpassword',
          })
          .expectStatus(400);
      });

      it('should throw an error if password is not correct', () => {
        return pactum
          .spec()
          .post('/auth/local/login')
          .withBody({
            email: dto.email,
            password: 'wrongpassword',
          })
          .expectStatus(400);
      });

      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/local/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userId', 'data.user.id')
          .stores('accessToken', 'data.tokens.accessToken');
      });
    });
  });

  describe('Users', () => {
    describe('Get User', () => {
      it('should throw an error if token was not provided', () => {
        return pactum
          .spec()
          .get('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .expectStatus(401);
      });

      it('should throw an error if wrong token was provided', () => {
        return pactum
          .spec()
          .get('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}:C' })
          .expectStatus(401);
      });

      it('should return null if userId is wrong', () => {
        return pactum
          .spec()
          .get('/users/{id}')
          .withPathParams('id', 'wrongId')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .expectStatus(200)
          .expectJsonMatch({ data: { user: null } })
          .inspect();
      });

      it('should return the last user created', () => {
        return pactum
          .spec()
          .get('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .expectStatus(200)
          .expectJsonMatch({ data: { user: { id: '$S{userId}' } } });
      });
    });
  });
});
