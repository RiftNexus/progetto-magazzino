import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  
  if (req.session.userId === undefined) {
    return res.status(401).send('Non puoi entrare se non sei loggato!');
    
  }
  
  console.log('User ID:', req.session.userId);

  try {
    
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { isAdmin: true },
    });

    
    if (user?.isAdmin) {
      next();
    } else {
      res.status(403).send('Non sei un amministratore!');
    }
  } catch (error) {
    console.error('Errore durante la verifica dell\'amministratore:', error);
    res.status(500).send('Internal Server Error');
  }
};
