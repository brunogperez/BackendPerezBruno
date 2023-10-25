import express from 'express'
import routerProducts from './router/products.router.js'
import routerCarts from './router/carts.router.js'

const port = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static('./src/public'))

app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)

app.listen(port, () => console.log(`Server running in port ${port}`))