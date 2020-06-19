module.exports = [
  {
    name: "development",
    type: "postgres",
    url: "postgres://postgres:test@localhost:5432/test",
    synchronize: true,
    dropSchema: false,
    logging: true,
    logger: "advanced-console",
    entities: ["src/modules/**/*.entity.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/modules",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  },
  {
    name: "production",
    type: "postgres",
    url: "postgres://postgres:test@localhost:5432/test",
    logging: true,
    logger: "advanced-console",
    entities: ["dist/modules/**/*.entity.js"],
    migrations: ["dist/migration/**/*.js"],
    subscribers: ["dist/subscriber/**/*.js"],
    cli: {
      entitiesDir: "dist/modules",
      migrationsDir: "dist/migration",
      subscribersDir: "dist/subscriber",
    },
  },
];
