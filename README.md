## Requirements 💼

| Program        | Version |
| -------------- | ------- |
| NodeJS         | 14.16.1 |
| npm            | 7.11.2  |
| docker         | 20.10.5 |
| docker-compose | 1.29.0  |

## Installation 💾

| Command                 | Description                     |
| ----------------------- | ------------------------------- |
| npm install             | Install required dependencies   |
| npm run bootstrap       | Bootstrap dependencies          |
| npm run prisma:generate | Generate types based on schema  |
| npm test                | Run tests in all packages       |
| docker-compose up -d    | Start database in detached mode |
| npm run start:dev       | Run server in development mode  |
| npm run build           | Compile server                  |
| npm run start           | Run compiled server             |

## Important 💥

```sh
If you want to "dockerize" this application, in ".env" file, replace "DATABASE_URL" "localhost" with name of your database container in "docker-compose"`.
For example "postgresql://nscode:password@localhost:5432/movie-api?schema=movie_api" will be replaced with "postgresql://nscode:password@db:5432/movie-api?schema=movie_api"
```

## ENDPOINTS

### `[POST] /auth/register` | Register new user

```sh
# payload
# application/json
{
    email: "nscode@example.com",
    password: "P@ssw0rd!11",
    type: 1 # Premium user | 0 Basic user,
    username: "nickname",
}

# response
# application/json
{
    status: 'success'
}
```

### `[POST] /auth/login` | Login

```sh
# payload
# application/json
{
    email: "nscode@example.com",
    password: "P@ssw0rd!11",
}

# response
# application/json
{
   token: "Bearer 0658010ff6f8f5c456f06835025f88"
}
```

### `[POST] /auth` | Auth information

Require: `authentication: Bearer <token>`

```sh
# response
# application/json
{
   token: "0658010ff6f8f5c456f06835025f88",
   userId: 1
}
```

### `[POST] /movies` | Add movie to collection

Require: `authentication: Bearer <token>`

```sh
# payload
# application/json
{
    title: "Joker",
}

# response
# application/json
{
    status: 'success'
}
```

### `[GET] /movies` | Get users movies

Require: `authentication: Bearer <token>`

```sh
# response
# application/json
{
    data: [
        {
            title: "Joker",
            director: "Todd Phillips",
            released: "04 Oct 2019",
            genre: "Crime, Drama, Thriller"
        }
    ]
}
```

## COPY `.env.example` to `.env` 🙈

```sh
cat .env.example > .env
```

## PUT YOUR [API_KEY](https://omdbapi.com/apikey.aspx) TO `.env` 🙈

```sh
# .env
API_KEY=<you-api-key>
```

## Running tests

```sh
npm run test
```

## Starting server 🚀

```sh
 npm install
 npm run bootstrap
 docker-compose up -d
 npm run build
 npm run start
```

## Start using docker 📦

```sh
docker-compose build
docker-compose up
```
