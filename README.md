# 📖 Auth API

A versatile REST API for authentication featuring local, GitHub, and Google sign-up options.

## 😁 Crafted with

✅ Nest.js

✅ Prisma

✅ Pactum (E2E Testing)

## 🌟 Features

⭐️ JWT access and refresh tokens

⭐️ Google OAuth

⭐️ Github OAuth

⭐️ Private and public routes

## 🛠 Installation

```bash
$ pnpm install
```

## 🔒 .env
Create a .env file and fill it following the structure provided in the .env.template file for the proper functioning of the app.

## 🚀 Running the app

```bash
# Make sure you have docker running
$ pnpm db:dev:up

# watch mode
$ pnpm start:dev

# production mode
$ pnpm run start:prod
```

## 🧪 Test
```bash
# Make sure you have docker running
$ pnpm db:test:up

# e2e tests
$ pnpm test:e2e
```

## License

Nest is [MIT licensed](LICENSE).# trello-clone
