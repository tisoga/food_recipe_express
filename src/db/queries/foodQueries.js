const queryGetAllFoodData = `
    SELECT fd_.id, fd_.name, fd_.image, fd_.category, users.fullname as created_by 
    FROM food_data as fd_ 
    INNER JOIN users ON users.id = fd_.created_by
    ORDER BY fd_.id ASC
`

const queryGetFoodDataByID = `
    SELECT fd_.id, fd_.name, fd_.image, fd_.category, fd_.recipe , users.fullname as created_by
    FROM food_data as fd_
    INNER JOIN users ON users.id = fd_.id
    WHERE fd_.id = $1
`

const queryInsertFoodData = `
    INSERT INTO food_data (name, image, category, recipe, created_by)
    VALUES ($1, $2, $3, $4, $5)
`

const updateFoodData = (column) => {
    const query = `
        UPDATE food_data
        SET ${column} = $2
        WHERE id = $1
    `
    return query
}

const allQuery = {
    getAllFoodData: queryGetAllFoodData,
    getFoodDataByID: queryGetFoodDataByID,
    insertFoodData: queryInsertFoodData,
    updateFoodData: updateFoodData
}

export default allQuery