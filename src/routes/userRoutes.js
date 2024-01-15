import { Router } from 'express';
import { getUser, insertNewUser, listAllUser, loginUser } from '../controller/userController.js';

const router = Router()

router.get('/users', listAllUser)

router.get('/user', getUser)

router.post('/login', loginUser)

router.post('/register', insertNewUser)

export default router