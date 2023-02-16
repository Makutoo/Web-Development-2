import express from 'express';
// const session = require('express-session')
import session from 'express-session'
import configRoutes from './routes/index.js';
const app = express();
app.use(express.json());

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}))

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});