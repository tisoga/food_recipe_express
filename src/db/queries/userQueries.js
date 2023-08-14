const queryInsertNewUser = `
    INSERT INTO users(email, fullname, password)
    VALUES ($1, $2, $3)
`

const queryCheckEmailUser = `
    SELECT * FROM users
    WHERE email = $1
`

const queryCheckUser = `
    SELECT * FROM users
    WHERE id = $1
`

export default {
    insertNewUser: queryInsertNewUser,
    checkEmail: queryCheckEmailUser,
    checkUser: queryCheckUser
}