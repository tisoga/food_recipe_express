import { Router } from 'express';
import { editFoodData, editOrAddFoodData, getAllFoodData, getFoodDataByID, newFoodData } from '../controller/foodController.js'
import authCheckToken from '../middleware/authCheck.js';

const router = Router()

router.get('/food-data', getAllFoodData)

router.post('/food-data', authCheckToken, newFoodData)

router.get('/food-data/:id', getFoodDataByID)

router.patch('/food-data/:id', authCheckToken, editFoodData)

router.put('/food-data/:id', authCheckToken, editOrAddFoodData)


export default router