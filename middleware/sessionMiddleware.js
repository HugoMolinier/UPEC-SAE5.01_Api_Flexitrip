const session = require("express-session");
const RedisStore = require("connect-redis").default;
const redisClient = require("../config/redis");

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 3600000,
  },
});

module.exports = sessionMiddleware;
