import { Router } from 'express'
import { CartManager } from '../managers/cartManager.js'

const router = Router()
const cartManager = new CartManager()

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.send(carts)

    } catch (error) {
        res.status(500).send('Error al obtener los carritos' + error)
    }
})

router.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid)
    const cart = await cartManager.getCartById(id)
    res.send(cart)

})

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createCart()
        res.send(cart)
    } catch (err) {
        res.status(500).send("Error al crear el carrito" + err)
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)

        const product = await cartManager.addProductToCart(cid, pid)

        res.send(product)

    } catch (err) {
        res.status(500).send("Error al agregar producto al carrito" + err)
    }
})

export default router