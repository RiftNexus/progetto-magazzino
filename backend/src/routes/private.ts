import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../middleware/isAuthMid';

const prisma = new PrismaClient();

const privateRoutes = (router: Router) => {
  router.get('/user', isAuthenticated, async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    res.status(200).json(user);
  });

  router.get('/products', isAuthenticated, async (req: Request, res: Response) => {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  });

  router.post('/product/:id', isAuthenticated, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: { quantity },
      });
      res.status(200).json(product);
    } catch (error) {
      res.status(400).send('Prodotto non trovato');
    }
  });
};

export default privateRoutes;
