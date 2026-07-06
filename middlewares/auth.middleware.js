import jwt from 'jsonwebtoken'

const auth=(req,res,next)=>{
    try{
        const authorization =  req.headers.authorization
    if(!authorization|| !authorization.startsWith("Bearer")){
        res.status(401).json({error:"token requerido"});
        return;
        }
    const tkn = authorization.split(' ')[1];
        
            const tknverify = jwt.verify(tkn,process.env.JWT_SECRET);
            req.user = tknverify;
            next();

        
    }catch(error){
                return res.status(401).json({error:"token requerido"});

    }   
}
export const esAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
    }
    next();
};

export default auth;