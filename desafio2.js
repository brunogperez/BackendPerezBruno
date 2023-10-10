
const fs = require('fs')


class ProductManager {

    #path
    #products

    constructor(path) {
        this.#path = path
        this.#products = []

    }
    //Creamos un método para generar un ID para cada producto nuevo 
    #generateID = async () => {
        return this.#products.length === 0 ? 1 : this.#products[this.#products.length - 1].id + 1
    }

    //Creamos un método para validar los campos y que no se repita el campo code
    #validateProduct = async (product) => {
        for (const [key, value] of Object.entries(product)) {
            if (!value) {
                console.log(`El producto ${product.title} tiene el campo ${key} incompleto`)
                return false
            }
        }
        const existProduct = await this.#products.find(p => p.code === product.code)
        if (existProduct !== undefined) {
            console.log(`Ya existe un producto con el código ${product.code}`)
            return false
        }
        return true
    }

    //Método para agregar productos al array 
    addProduct = async (title, description, price, thumbnail, code, stock) => {

        const newProduct = { id: await this.#generateID(), title, description, price, thumbnail, code, stock }

        if (this.#validateProduct(newProduct)) {

            this.#products.push(newProduct)
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, '\t'))
            return newProduct
        }
    }

    //
    getProducts = async () => {
        try {
            if(!fs.existsSync(this.#path)) return this.#products

            const products = await fs.promises.readFile(this.#path, 'utf-8')
            this.#products = JSON.parse(products)
            return this.#products

        } catch (error) {
            return error
        }
    }

    getProductByID = async (id) => {

        const products = await this.getProducts()

        const findProduct = products.find(item => item.id === id)

        if (findProduct) return findProduct
        else console.error(`El producto con ID ${id} no se ha encontrado`)

    }

    updateProduct = async (id, update) => {

        const ix = this.#products.findIndex(p => p.id === id)
        if (ix !== -1) {
            const isValid = await this.#validateProduct(update)
            if (!isValid) {
                return console.log('Error al actualizar')
            }
            this.#products[ix] = { ...this.#products[ix], ...update }
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, '\t'))
            return console.log('Producto actualizado')
        }
        return console.log('Error al actualizar: Producto no encontrado')
    }

    deleteProduct = async (id) => {
        try {
            const product = this.#products.find(p => p.id === id)
            if (!product) {
                return `No existe un producto con el ID ${id}`
            }

            const filteredProducts = this.#products.filter(p => p.id !== id)

            if (this.#products.length !== filteredProducts.length) {
                await fs.promises.writeFile(this.#path, JSON.stringify(filteredProducts, null, '\t'))
                return `El producto ${product.title} ha sido eliminado.`
            }

        } catch (e) {
            console.log(e)
        }
    }
}


const productManager = new ProductManager('./products.json')

//Mostramos en consola el array vacío en una primera instancia.
productManager.getProducts()

//Llamamos al método addProduct para agregar productos a la base de datos

productManager.addProduct(
    'producto prueba',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc123',
    25
)

//Producto con campos incompletos
productManager.addProduct(
    'producto prueba 2 ',
    'Este es un producto prueba',
    200,
    25
)

//Producto con el código repetido
productManager.addProduct(
    'producto prueba 3',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc1',
    25
)

productManager.addProduct(
    'producto prueba 4 ',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc12',
    25
)

//Llamamos el metodo getProducts para traer el array con los productos agregados
console.log(productManager.getProducts())

//Buscamos productos por ID
console.log(productManager.getProductByID(1))

//Llamamos al método updateProduct para cambiar un campo
console.log(productManager.updateProduct(1, { title: 'producto modificado' }))

//Borramos un producto con un ID especifico
console.log(productManager.deleteProduct(2))
