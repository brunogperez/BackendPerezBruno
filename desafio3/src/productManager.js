import fs from 'fs'

class ProductManager {

    #path
    #format

    constructor(path) {
        this.#path = path
        this.#format = 'utf-8'
        this.products = []
    }

    #generateId = async() => {
        const products = await this.getProducts()
        return products.length === 0 ? 1 : products[products.length -1].id + 1
    }

    #validateProduct = async(product) => {
        for (const [key, value] of Object.entries(product)) {
            if (!value) {
                console.log(`El producto ${product.title} tiene el campo ${key} incompleto`)
                return false
            }
        }
        // const products = await this.getProducts()  
        const existingProduct = await this.products.find(p => p.code === product.code)      
        if (existingProduct !== undefined) {  
            console.log(`Ya existe un producto con el código ${product.code}`)
            return false   
        }
        return true 
    }

    addProduct = async(title, description, price, thumbnail, code, stock) => {
        // validar los tipos de datos de entrada
        if (typeof title !== 'string' || typeof description !== 'string' || typeof thumbnail !== 'string' || typeof code !== 'string') {
            console.log('Error: title, description, thumbnail y code deben ser tipo string')
            return
        }
        price = parseFloat(price)
        stock = parseInt(stock)
        if (typeof price !== 'number' || typeof stock !== 'number') {
            console.log('Error: price y stock deben ser tipo number')
            return
        }

        // const products = await this.getProducts()  
        const newProduct = {id: await this.#generateId(), title, description, price, thumbnail, code, stock}   

        if (this.#validateProduct(newProduct)) {   
            this.products.push(newProduct)   
            await fs.promises.writeFile(this.#path, JSON.stringify(this.products, null, '\t'))    
            return newProduct       
        }
    }

    getProducts = async() => {
        try {
            return JSON.parse(await fs.promises.readFile(this.#path, this.#format))   
        } catch (err) {
            console.log('error: archivo no encontrado')    
            return []
        }
    }

    getProductById = async(id) => {
        const products = await this.getProducts()    
        const product = products.find(p => p.id === id)    
        return product 
    }

    updateProduct = async(id, update) => {
        // const products = await this.getProducts()   
        const index = this.products.findIndex(p => p.id === id)  

        if (index !== -1) { 
            const isValid = await this.#validateProduct(update) 
            if (!isValid) {     
                return console.log('Error al actualizar: Actualización inválida')
            }
            this.products[index] = { ...this.products[index], ...update }     

            await fs.promises.writeFile(this.#path, JSON.stringify(this.products, null, '\t'))  

            return console.log('Producto actualizado', this.products[index])     
        }
        return console.log('Error al actualizar: Producto no encontrado')   
    }

    deleteProduct = async(id) => {
        try {
            const product = this.products.find(p => p.id === id)
            if (!product) {
                return `No existe un producto con el ID ${id}`
            }
            const filterProducts = this.products.filter(p => p.id !== id)
            if (this.products.length !== filterProducts.length) {
                await fs.promises.writeFile(this.#path, JSON.stringify(filterProducts, null, '\t'))
                return `${product.title}: Producto eliminado exitosamente`
            }
        } catch (err) {
            console.log(err)      
        }
    }
}


export const productManager = new ProductManager('./products.json')