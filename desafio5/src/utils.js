import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { config } from 'dotenv'

config()

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
export const MONGO_URI = process.env.MONGO_URI
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME
export const PORT = 8080

export const validatePassword = (user, password) => {
    // Comparación de contraseñas en texto plano (NO RECOMENDADO)
    return user.password === password
}

export const AuthRol = (req, res, next) => {
    const user = req.session?.user

    if (user) {
        user.role = user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123' 
            ? 'Admin' 
            : 'User'
        
        delete user.password
    }

    return next()
}