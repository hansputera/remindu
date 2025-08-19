# Elysia with Bun runtime

## Getting Started
1. install dependency using npm
```bash
npm install
```
2. running migration
```bash
npm run db:migrate
```
3. reset migration
  - create new schema / update schema
```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
```

## Development
To start the development server run:
```bash
npm run dev
```

- Open http://localhost:3000 with your browser to see the result or replace the PORT.
- Open http://localhost:3000/docs for showing scalar documentation