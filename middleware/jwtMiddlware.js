const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    
    // Check if the header is present and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or token format is incorrect' });
    }
    
    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];
    
    try {
        // Verify the token
        const jwtResponse = jwt.verify(token, 'secret000');
        console.log(jwtResponse);
        
        // Attach user information to the request object
        req.payload = jwtResponse.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: `Authorization failed: ${error.message}` });
    }
};

module.exports = jwtMiddleware;
