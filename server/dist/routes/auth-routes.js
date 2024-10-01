import { Router } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// Login function
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        return res.json({ token });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error logging in' });
    }
};
const router = Router();
router.post('/login', login);
export default router;
