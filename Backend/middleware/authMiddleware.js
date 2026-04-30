import  jwt  from 'jsonwebtoken';


export const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader){
        res.status(401).json({message: "No token Provided"})
    }

    const token  = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode;
        next();
        
    } catch (error) {
        return res.status(403).json({message:"Invalid or expired token"});
    }
}