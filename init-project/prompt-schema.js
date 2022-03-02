module.exports = schema = (env) => ({
  properties: {
    DATABASE_USERNAME: {
      type: "string",
      message: "database name format is incorrect",
      description: "database username",
      default: env.DATABASE_USERNAME,
    },
    DATABASE_PASSWORD: {
      type: "string",
      message: "format is incorrect",
      description: "database password",
      default: env.DATABASE_PASSWORD,
      hidden: true,
      replace: "*",
    },
    DATABASE_NAME: {
      pattern: /^[^\\/?%*:|\"<>.]{1,64}$/,
      type: "string",
      message: "database name format is incorrect",
      description: "database name",
      default: env.DATABASE_NAME,
    },
    DATABASE_PORT: {
      message: "database port must be a number",
      type: "integer",
      description: `database port`,
      default: env.DATABASE_PORT,
    },
    DATABASE_HOST: {
      message: "database format is incorrect",
      type: "string",
      description: `database host`,
      default: env.DATABASE_HOST,
    },
  },
});
