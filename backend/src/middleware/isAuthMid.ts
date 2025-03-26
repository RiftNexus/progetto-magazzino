import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = async (request: Request, response: Response, next: NextFunction) => {
    let isLogged = false;

    if (request.session.userId !== undefined) {
        isLogged = true
    }

    if (!isLogged) {
        response.status(401).json('Devi loggarti prima di accedere');
        return;
    }

    next();
}