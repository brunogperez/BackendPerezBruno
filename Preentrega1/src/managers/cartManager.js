import fs from 'fs'
import { productManager } from './productManager.js'


export class CartManager {
    constructor(path) {
        this.path = path
        this.carts = []
    }

    createCart = async () => {
        try {
            if (!fs.existsSync(this.path)) {
                const cart = {
                    id: this.carts.length + 1,
                    productos: []
                }
                this.carts.push(cart)
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '/t'))
                return 'Se creó el carrito correctamente'
            }

            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)

            const cart = {
                id: this.carts.length + 1,
                productos: []
            }

            this.carts.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '/t'))
            return 'Se creó el carrito correctamente'

        } catch (error) {
            return error
        }
    }

    getCarts = async () => {
        try {
            if (!fs.existsSync(this.path)) return this.carts

            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)

            return this.carts

        } catch (error) {
            return error
        }
    }

    getCartsByID = async (cid) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.cart = JSON.parse(data)

            const cart = this.carts.find(cart => cart.id === cid)
            return cart ? cart : 'Carts not found'

        } catch (error) {
            return error
        }
    }

    addProductToCart = async (cid, pid) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)

            const carrito = this.carts.find(cart => cart.id === cid)
            const prod = await productManager.getProductById(pid)

            if (!prod) return 'Product not found'
            if (!carrito) return 'Carrito not found'

            const product = carrito.productos.find(p => p.pid === pid)
            if (!product) {
                carrito.productos.push({ pid: pid, quantity: 1 })
            } else {
                product.quantity++
            }

            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '/t'))
            return 'Producto agregado al carrito correctamente'

        } catch (error) {
            return error
        }
    }
}

export const cartManager = new CartManager()