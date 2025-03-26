import publicRoutes from './public';
import privateRoutes from './private';
import adminRoutes from './admin';
import { Router, Express } from 'express';

const router = Router();

const mapRoutes = (app: Express) => {
    const router = Router();

    publicRoutes(router);
    privateRoutes(router);
    adminRoutes(router);
    

    app.use('/rest',router);
}

export default mapRoutes


