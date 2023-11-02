import express from 'express'
import { Server } from 'socket.io'
import __dirname from './utils.js'


const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))



const httpServer = app.listen(PORT, () => console.log(`Server is running in port ${PORT}`))
httpServer.on('error', error => console.log(error))

const socketServer = new Server(httpServer)

app.set('socketio', socketServer)
app.use(express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', `${__dirname}/views`)


app.get('/', (req, res) => res.status(200).render('index', { name: 'name' }))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/home', viewsRouter)

io.on('connection', socket => {
    console.log('New client connected to the Server')
    socket.on('productList', data => {
        io.emit('updatedProducts', data)
    })
})