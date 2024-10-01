import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.sendStatus(401); // Return on this path
        return; // Stop execution
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            res.sendStatus(403); // Return on this path
            return; // Stop execution
        }
        const payload = decoded;
        if (!payload || !payload.username) {
            res.sendStatus(403); // Return on this path
            return; // Stop execution
        }
        req.user = payload; // Assign the user to the request object for further use
        next(); // Proceed to the next middleware (This is the successful path)
    });
};
