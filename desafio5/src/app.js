import express from 'express'
import exphbs from 'express-handlebars'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { __dirname, PORT, MONGO_DB_NAME, MONGO_URI } from './utils.js'

import messageModel from './dao/models/messages.model.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsProductsRouter from './routes/views.router.js'
import sessionRouter from './routes/session.router.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

// Configuracion de Handlebars
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }))
app.set('views', __dirname + '/views')
app.set('view engine', '.hbs')

// Configuracion de las sesiones en mongo
const sessionStore = MongoStore.create({
    mongoUrl: MONGO_URI,
    dbName: 'DBPerezBruno'
})

sessionStore.on('error', (error) => {
    console.error('Error en la conexión de almacenamiento de sesión:', error)
})

app.use(session({
    store: sessionStore,
    secret: 'secret',
    // resave: true,
    resave: true,
    saveUninitialized: true
}))

// Routes
app.get('/', (req, res) => res.render('index', { name: 'Chucho' }))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/products', viewsProductsRouter)
app.use('/sessions', sessionRouter)

// Permite realizar consultas incluso en campos no definidos en el esquema, cuando se establece en 'false' 
mongoose.set("strictQuery", false)

try {
    await mongoose.connect(`${MONGO_URI}${MONGO_DB_NAME}`)
    console.log("DB connected 😎")
    
    const httpServer = app.listen(PORT, () => console.log(`Server listening on port ${PORT} 🏃...`))

    const io = new Server(httpServer)
    app.set('socketio', io)

    io.on('connection', async (socket) => {
        socket.on('productList', (data) => {
            console.log(data)
            io.emit('updatedProducts', data)
        })
        socket.on('cartList', (data) => {
            io.emit('updatedCarts', data)
        })

        let messages = (await messageModel.find()) ? await messageModel.find() : []

        socket.broadcast.emit('alerta')
        socket.emit('logs', messages)
        socket.on('message', (data) => {
            messages.push(data)
            messageModel.create(messages)
            io.emit('logs', messages)
        })
    })
} catch (error) {
    console.log(`Cannot connect to dataBase: ${error}`)
    process.exit()
}