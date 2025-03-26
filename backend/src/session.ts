import 'express-session'

declare module 'express-session' {
    interface SessionData {
        userId:number;
        email:string;
        name?:string;
        isAdmin?:boolean;
    }
}