import bycrypt from 'bcrypt'

const hashingPassword = async (password) => {
    const salt = await bycrypt.genSalt()
    const hashPassword = await bycrypt.hash(password, salt)
    return hashPassword
}

export default hashingPassword