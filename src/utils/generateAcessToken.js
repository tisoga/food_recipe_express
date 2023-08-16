import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config/index.js'

const generateAccessToken = async (userData) => {
    const token = await jwt.sign(userData, TOKEN_SECRET, { expiresIn: '30m' })
    return token
}

export default generateAccessToken