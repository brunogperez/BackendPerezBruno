import express from 'express'
import { productManager } from './productManager.js'

const app = express()

app.get('/products', async (req, res) => {
    try {
        const limitProd = req.query.limit

        const products = await productManager.getProducts()

        if (!limitProd) res.send(products)
        else {
            const prodLimited = products.slice(0, limitProd)
            res.send(prodLimited)
        }
    } catch (error) {
        res.send('No se encontraron los productos')
    }
})

app.get('/products/:pid', async (req, res) => {
    try {

        const productID = parseInt(req.params.pid)
        const products = await productManager.getProductById(productID)

        if (!products) res.send(`El producto de ID ${productID} no existe`)
        else res.send(products)

    } catch (error) {
        res.send('No se encontró el producto')
    }
})


const portServer = 8080


app.listen(portServer, ()=> console.log(`Server Express en el puerto ${portServer}`))