import express from 'express';
import configRoutes from './routes/index.js';
import session from 'express-session'

import  RedisStore  from 'connect-redis';
let redisStore = RedisStore(session);
import Redis from 'ioredis'
const redisClient = new Redis()


const app = express();
app.use(express.json());

app.use(session({
    store: new redisStore({ client: redisClient }),
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}))

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});