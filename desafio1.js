class ProductManager {

    #products
    #error

    constructor() {
        this.#products = []
        this.#error = undefined
    }
    //Creamos un método para generar un ID para cada producto nuevo 
    #generateID = () => (this.#products.length === 0) ? 1 : this.#products[this.#products.length - 1].id + 1

    //Creamos un método para validar los campos y que no se repita el campo code
    #validateProduct = (title, description, price, thumbnail, code, stock) => {

        if (!title || !description || !price || !thumbnail || !code || !stock) {

            return this.#error = `el producto ${title} tiene campos incompletos`

        } else {

            const existProduct = this.#products.find(product => product.code === code)

            if (existProduct) {
                this.#error = `El código del producto ${title} ya existe`
            } else {
                this.#error = undefined
            }
        }


    }

    //Método para agregar productos al array 
    addProduct = (title, description, price, thumbnail, code, stock) => {

        this.#validateProduct(title, description, price, thumbnail, code, stock)

        if (this.#error === undefined) {

            this.#products.push({ id: this.#generateID(), title, description, price, thumbnail, code, stock })

        } else {
            console.log(this.#error)
        }

    }

    //
    getProducts = () => this.#products

    getProductByID = (id) => {

        const findProduct = this.#products.find(item => item.id === id)

        if (findProduct) return findProduct
        else console.error(`El producto con ID ${id} no se ha encontrado`)

    }
}


const productManager = new ProductManager()

//Mostramos en consola el array vacío en una primera instancia.
console.log(productManager.getProducts())

//Llamamos al método addProduct para agregar productos a la base de datos

productManager.addProduct(
    'producto prueba 1 ',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc1',
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
console.log(productManager.getProductByID(2))
console.log(productManager.getProductByID(1))

//Buscamos un producto con un ID inexsistente
console.log(productManager.getProductByID(8))
