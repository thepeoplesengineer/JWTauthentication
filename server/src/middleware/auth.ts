import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401); // Return on this path
    return; // Stop execution
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
    if (err) {
      res.sendStatus(403); // Return on this path
      return; // Stop execution
    }

    const payload = decoded as CustomJwtPayload;

    if (!payload || !payload.username) {
      res.sendStatus(403); // Return on this path
      return; // Stop execution
    }

    req.user = payload; // Assign the user to the request object for further use
    next(); // Proceed to the next middleware (This is the successful path)
  });
};
