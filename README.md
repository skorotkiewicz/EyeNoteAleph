# EyeNote - AlephJS

## WIP

```sh
deno task dev
deno task build
```

## Prisma Database

1. Rename `dotenv` to `.env` and fill with your data.
   Your need a postgres DB and proxy from cloud.prisma.io.

2. `deno task prisma:push` run with your DB
3. Then run `deno task prisma:generate`
4. `deno task prisma:generate` run with Proxy DB

```sh
deno task prisma:init # (optional)
deno task prisma:push
deno task prisma:generate
```
