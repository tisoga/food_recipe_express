import db from '../db/connection.js'
import foodQuery from '../db/queries/foodQueries.js'
import validator from 'validator'

export const getAllFoodData = async (req, res) => {
    const { search, category } = req.query
    try {
        if (search && category) {
            const result = await db.query(foodQuery.searchFoodDataByCategory(search), [category])
            return res.status(200).json(result.rows)
        }
        if (search) {
            const result = await db.query(foodQuery.searchFoodData(search))
            return res.status(200).json(result.rows)
        }
        if (category) {
            console.log(category)
            const result = await db.query(foodQuery.getAllFoodDataByCategory, [category])
            return res.status(200).json(result.rows)
        }
        const result = await db.query(foodQuery.getAllFoodData)
        res.status(200).json(result.rows)
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something Error' })
    }
}

export const getFoodDataByID = async (req, res) => {
    const { id } = req.params
    try {
        const result = await db.query(foodQuery.getFoodDataByID, [id])
        if (!result.rows[0]) {
            res.status(404).json({ error: 'Food ID did not exist' })
        }
        res.status(200).json(result.rows[0])
    }
    catch (e) {
        console.log(e.code)
        res.status(500).json({ error: 'Something Error' })
    }
}

export const newFoodData = async (req, res) => {
    const { name, image, category, recipe } = req.body
    const errors = []

    if (!name) {
        errors.push('name required')
    }

    if (!validator.isURL(image)) {
        errors.push('image should be valid URL')
    }

    if (!Array.isArray(category)) {
        errors.push('category type should be Array')
    }
    else if (category.length === 0 || !category) {
        errors.push('category should be not empty')
    }

    if (!Array.isArray(recipe)) {
        errors.push('recipe type should be Array')
    }
    else if (recipe.length === 0 || !recipe) {
        errors.push('recipe should be not empty')
    }


    if (errors.length > 0) {
        return res.status(422).json({ error: errors.join(', ') })
    }

    await db.query(foodQuery.insertFoodData, [name, image, category, recipe, req.userId])
    const data = {
        name,
        image,
        category,
        recipe
    }
    res.status(201).json(data)
}

export const editFoodData = async (req, res) => {
    const { id } = req.params
    const { name, image, category, recipe } = req.body

    try {
        const result = await db.query(foodQuery.getFoodDataByID, [id])
        if (!result.rows[0]) {
            return res.status(404).json({ error: 'Food ID did not exist' })
        }
        const foodData = result.rows[0]

        if (name) {
            const columnName = 'name';
            await db.query(foodQuery.updateFoodData(columnName), [id, name])
            foodData.name = name
        }
        if (image) {
            const columnName = 'image';
            await db.query(foodQuery.updateFoodData(columnName), [id, image])
            foodData.image = image
        }
        if (category?.length > 0) {
            const columnName = 'category';
            await db.query(foodQuery.updateFoodData(columnName), [id, category])
            // foodData.category = category
        }
        if (recipe?.length > 0) {
            const columnName = 'recipe';
            await db.query(foodQuery.updateFoodData(columnName), [id, recipe])
            foodData.recipe = recipe
        }

        res.status(200).json(foodData)

    }
    catch (e) {
        console.log(e.code)
        res.status(500).json({ error: 'Something Error' })
    }
}

export const editOrAddFoodData = async (req, res) => {
    const { id } = req.params
    try {
        const result = await db.query(foodQuery.getFoodDataByID, [id])
        if (!result.rows[0]) {
            return newFoodData(req, res)
        }
        return editFoodData(req, res)
    }
    catch (e) {
        console.log(e.code)
        res.status(500).json({ error: 'Something Error' })
    }
}