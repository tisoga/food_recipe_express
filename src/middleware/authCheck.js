import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config/index.js';

const authCheckToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.sendStatus(401)
    }
    try {
        const result = jwt.verify(token, TOKEN_SECRET)
        req.userId = result.id
        next()
    }
    catch (e) {
        return res.sendStatus(403)
    }
}

export default authCheckToken