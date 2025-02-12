import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/env.js";
import User from "../models/user.model.js";

export const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) return res.status(401).json({message: 'Unauthorized'});
        // This jsonwebtoken verify method is used to verify the token.
        const decoded = jwt.verify(token, JWT_SECRET);
        // Checking to view if the user exist or not
        const user = await User.findById(decoded.userId)
        if (!user) return res.status(401).json({message: 'Unauthorized'});
        req.user = user; // attaching the user to the request
        next()
    }catch (error) {
        res.status(401).json({message: "Unauthorized", error: error.message})
    }
}