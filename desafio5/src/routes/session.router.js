import { Router } from 'express'
import userModel from '../dao/models/users.model.js'
import { validatePassword } from '../utils.js'

const router = Router()

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
});

// API para login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).json({ status: 'error', error: 'Incomplete values' })

    const user = await userModel.findOne({ email: email })

    if (!user || !validatePassword(user, password)) {
        return res.status(401).render('errors/errorPage', { error: 'Wrong password or username' })
    }

    req.session.user = user
    res.redirect('/products')
})

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
});

// API para crear usuarios en la DB
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body
    if (!first_name || !last_name || !email || !age || !password)
        return res.status(400).json({ status: 'error', message: 'error Register' })

    let user = {
        first_name,
        last_name,
        email,
        age,
        password, // Almacenamos la contraseña en texto plano
    }

    const existUser = await userModel.findOne({ email: user.email })

    if (existUser) return res.json({ status: 'error', message: 'Ya existe un usuario con ese email' })

    await userModel.create(user)
    res.redirect('/sessions/login')
})

// Eliminar Session
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
            return res.status(500).render('errors/errorPage', { error: err })
        }
        res.redirect('/sessions/login')
    })
})

router.get('/error', (req, res) => {
    res.render('errors/errorPage')
})

export default router