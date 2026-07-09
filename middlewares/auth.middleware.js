import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    console.log('=== AUTH MIDDLEWARE ===');
    console.log('Headers Authorization:', req.headers.authorization);
    console.log('Cookies:', req.cookies);
    console.log('Token desde cookie:', req.cookies?.token);
    
    try {
        let token = req.headers.authorization?.split(' ')[1];
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        console.log('Token final:', token);
        
        if (!token) {
            return res.status(401).json({ error: "Token requerido" });
        }

        const tknverify = jwt.verify(token, process.env.JWT_SECRET);
        req.user = tknverify;
        console.log('Usuario autenticado:', req.user);
        next();
    } catch (error) {
        console.error('Error en auth:', error.message);
        return res.status(401).json({ error: "Token inválido" });
    }
};

export const esAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
    }
    next();
};

export default auth;