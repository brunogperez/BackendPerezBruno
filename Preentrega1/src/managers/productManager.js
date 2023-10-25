import fs from 'fs'

class ProductManager {

    #format

    constructor(path) {
        this.path = path
        this.#format = 'utf-8'
        this.products = []
    }

    generateId = async () => {
        const products = await this.getProducts()
        return products.length === 0 ? 1 : products[products.length - 1].id + 1
    }

    validateProduct = async (product) => {

        const products = await this.getProducts()
        const existingProduct = await products.find(item => item.code === product.code)

        if (existingProduct !== undefined) {
            console.log('Ya existe un producto con el mismo code')
            return false
        }
        return true
    }

    getProducts = async () => {
        try {


            const data = await fs.promises.readFile(this.path, this.#format)
            this.products = JSON.parse(data)

            return this.products

        } catch (err) {
            return err
        }
    }


    addProduct = async (title, description, price, thumbnail, code, category, stock) => {

        const products = await this.getProducts()

        const newProduct = {
            id: await this.generateId(),
            title,
            description,
            price,
            thumbnail: thumbnail || [],
            code,
            category,
            stock,
            status: true,
        }

        if (await this.validateProduct(newProduct)) {
            products.push(newProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
            this.products = products
            return newProduct
        }
    }


    getProductById = async (id) => {
        const products = await this.getProducts()
        const product = products.find(p => p.id === id)
        return product
    }

    updateProduct = async (id, update) => {
        // const products = await this.getProducts()   
        const index = this.products.findIndex(p => p.id === id)

        if (index !== -1) {
            const isValid = await this.validateProduct(update)
            if (!isValid) {
                return console.log('Error al actualizar: Actualización inválida')
            }
            this.products[index] = { ...this.products[index], ...update }

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))

            return console.log('Producto actualizado', this.products[index])
        }
        return console.log('Error al actualizar: Producto no encontrado')
    }

    deleteProduct = async (id) => {
        try {
            const product = this.products.find(p => p.id === id)
            if (!product) {
                return `No existe un producto con el ID ${id}`
            }
            const filterProducts = this.products.filter(p => p.id !== id)
            if (this.products.length !== filterProducts.length) {
                await fs.promises.writeFile(this.path, JSON.stringify(filterProducts, null, '\t'))
                return `${product.title}: Producto eliminado exitosamente`
            }
        } catch (err) {
            console.log(err)
        }
    }
}

export const productManager = new ProductManager('./api/products.json')