import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import  '../session';


const prisma = new PrismaClient();
const findLoggedUser = async (request:Request, response:Response)=>{
  const loggedUser = {
      email:request.session.email,
      name:request.session.name
  }

  response.status(200).json(loggedUser);
}

const publicRoutes = (router: Router) => {
  router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  if (!email) {
    res.status(400).send('Email mancante');
    return;
  }
  if (!password) {
    res.status(400).send('Password mancante');
    return;
  }
  
  try {
    const user = await prisma.user.findUnique({ 
      where: { email: email } 
    });

    if (!user) {
      res.status(401).send('Credenziali non valide');
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (isPasswordValid) {
      req.session.userId = user.id;
      req.session.email = user.email;
      req.session.name = user.name;
      req.session.isAdmin = user.isAdmin;
      
      res.status(200).send('Hai eseguito il login');
    } else {
      res.status(401).send('Credenziali non valide');
    }
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).send('Errore interno del server');
  }
});
  

  router.get('/products/public', async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        quantity: true,
      },
    });

    const simplifiedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      availability: product.quantity > 0 ? 'Disponibile' : 'Non disponibile',
    }));

    res.status(200).json(simplifiedProducts);
  });
};

export default publicRoutes;
