import jwt, { decode } from "jsonwebtoken";
import config from "../config.js";

function adminMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
   
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error : "No tokens provided"});
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token,config.JWT_ADMIN_PASSWORD);
        req.adminId = decoded.id;  
        next(); 
    } catch (error) {
        console.log("Invalid token or Expired");
        return res.status(401).json({error : "Error in verfication of token"});
    }
};


export default adminMiddleware;
