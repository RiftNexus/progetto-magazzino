import dotenv from 'dotenv';
import express from 'express';
import expressSession from 'express-session';
import cors from 'cors';
import'./session';
import mapRoutes from './routes/index';


dotenv.config();

const port = process.env.PORT;

if(process.env.SESSION_SECRET === undefined) {
    throw new Error('Impossibile avviare il server: manca SESSION_SECRET');
}

const app = express();

app.use((request, response, next)=>{
    console.log(request.method, request.url);
    next();
});

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))
app.use(express.json());
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    rolling:true,
    saveUninitialized: false,
    cookie:{
        maxAge: 86400000,
        sameSite: 'strict',
        secure: false
    }
}))

mapRoutes(app);

app.use('/', express.static('./public'));

app.listen(port, ()=>{
    console.log(`Server in ascolto sulla porta ${port}`)
})