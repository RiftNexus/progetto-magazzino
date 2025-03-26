import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../middleware/isAuthMid';
import { isAdmin } from '../middleware/isAdminMid';

const prisma = new PrismaClient();

const adminRoutes = (router: Router) => {
  router.post('/product', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    await isAdmin(req, res, next);
  }, async (req: Request, res: Response) => {
    const { name, quantity } = req.body;
    const product = await prisma.product.create({
      data: { name, quantity },
    });
    res.status(201).json(product);
  });

  router.delete('/product/:id', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    await isAdmin(req, res, next);
  }, 
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.product.delete({ where: { id: parseInt(id) } });
      res.status(200).send('Prodotto eliminato con successo');
    } catch (error) {
      res.status(400).send('ID Prodotto non valido');
    }
  });

  router.get('/users', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    await isAdmin(req, res, next);
  }, 
  async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  });
};

export default adminRoutes;
