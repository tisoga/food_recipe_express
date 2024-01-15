import db from '../db/connection.js'
import userQueries from '../db/queries/userQueries.js'
import generateAccessToken from '../utils/generateAcessToken.js'
import validator from 'validator'
import hashingPassword from '../utils/hashingPassword.js'
import bcrypt from 'bcrypt'


export const listAllUser = async (req, res) => {
    const result = await db.query('SELECT * FROM users')
    const token = generateAccessToken(result.rows[0])
    res.status(200).json(result.rows)
}

export const getUser = async (req, res) => {
    const { userId } = req
    const result = await db.query(userQueries.checkUser, [userId])
    const userData = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        fullName: result.rows[0].fullname,
    }
    res.status(200).json(userData)
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body
    const result = await db.query(userQueries.checkEmail, [email])

    if (!result.rows[0]) {
        return res.status(404).json({ error: 'email not registered' })
    }

    const match = await bcrypt.compare(password, result.rows[0].password)

    if (!match) {
        return res.status(400).json({ error: "wrong passwrod" })
    }

    const token = await generateAccessToken(result.rows[0])
    res.status(200).json({ token: token })
}

export const insertNewUser = async (req, res) => {
    const { email, fullname, password } = req.body
    const errors = []
    
    if (!validator.isEmail(email)) {
        errors.push('email is not valid')
    }
    else if (!email) {
        errors.push('email is required')
    }

    if (!fullname) {
        errors.push('fullname is required')
    }

    if (typeof fullname !== 'string' ){
        errors.push('Fullname not string type')
    }

    if (!password) {
        errors.push('password is required')
    }

    if (errors.length > 0) {
        return res.status(422).json({ error: errors.join(', ') })
    }

    const hashPassword = await hashingPassword(password)

    await db.query(userQueries.insertNewUser, [email, fullname, hashPassword])
    res.status(201).json({ success: `${email} succesfully created, please login.` })
}