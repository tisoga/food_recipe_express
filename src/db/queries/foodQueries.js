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

const queryGetAllFoodDataByCategory = `
    SELECT fd_.id, fd_.name, fd_.image, fd_.category, users.fullname as created_by 
    FROM food_data as fd_ 
    INNER JOIN users ON users.id = fd_.created_by
    WHERE LOWER($1) = ANY(SELECT LOWER(unnest(fd_.category)))
    ORDER BY fd_.id ASC;
`

const querySearchAllFoodData = (keyword) => {
    const query = `
        SELECT fd_.id, fd_.name, fd_.image, fd_.category, users.fullname as created_by 
        FROM food_data as fd_ 
        INNER JOIN users ON users.id = fd_.created_by
        WHERE fd_.name ILIKE '%${keyword}%'
        ORDER BY fd_.id ASC
    `
    return query
}

const querySearchAllFoodDataByCategry = (keyword) => {
    const query = `
        SELECT fd_.id, fd_.name, fd_.image, fd_.category, users.fullname as created_by 
        FROM food_data as fd_ 
        INNER JOIN users ON users.id = fd_.created_by
        WHERE LOWER($1) = ANY(SELECT LOWER(unnest(fd_.category)))
        AND fd_.name ILIKE '%${keyword}%'
        ORDER BY fd_.id ASC;
    `
    return query
}

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
    getAllFoodDataByCategory: queryGetAllFoodDataByCategory,
    updateFoodData: updateFoodData,
    searchFoodData: querySearchAllFoodData,
    searchFoodDataByCategory: querySearchAllFoodDataByCategry
}

export default allQuery