import { Router } from 'express'
import  { ProductManager } from '../managers/productManager.js'
import { storageMulter } from '../multer.js'

const router = Router()
const productManager = new ProductManager('.src/api/products.json')

const products = await productManager.getProducts()


router.get('/', async (req, res) => {

    try {

        const limitProd = parseInt(req.query.limit)

        if (!limitProd) res.send(products)
        else {
            const prodLimited = products.slice(0, limitProd)
            res.send(prodLimited)
        }
    } catch (error) {
        res.status(404).send('No se encontraron los productos')
    }
})

router.get('/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid) 
      if (isNaN(productId)) return res.status(400).json({ error: 'Product id must be a number' })
      
      const product = await productManager.getProductById(productId)
      if (!product) return res.status(404).json({ error: `The product with id ${productId} is not found` })
      return res.status(200).json({ product })
  } catch (err) {
      res.status(500).json({ error: err.message })
  }
  })

  router.post('/', async (req, res) => {
    try {
      let { title, description, price, thumbnail, code, category, stock, status } = req.body
      if ( !title || !description || !code || !price || !stock || !category ) {
        return res.status(400).json({ error: 'Hay campos incompletos' })
      }
      const addProduct = await productManager.addProduct( title, description, price, thumbnail, code, category, stock, (status = true) )
      if (addProduct) return res.status(201).json({ message: `El producto con id ${addProduct.id} fue agregado correctamente`, product: addProduct })
      return res.status(404).json({ error: 'Error al cargar el producto' })
    } catch (err) {
      return res.status(500).json({ error: err })
    }
  })

router.post('/', storageMulter.single('thumbnail'), async (req, res) => {
    try {

        if (!req.file) {
            res.status(500).send("No subiste la imagen")
        }

        const data = req.body
        const filename = req.file.filename

        data.thumbnail = `http://localhost:8080/images/${filename}`

        const producto = await productManager.getAddProducts(data)

        res.send(producto)
    } catch (error) {
        res.status(500).send("Error al cargar el producto: " + error)
    }

})

router.put('/:id', storageMulter.single('thumbnail'), async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        if (req.file) {
            const filename = req.file.filename
            data.thumbnail = `http://localhost:8080/images/${filename}`
        }

        const product = await productManager.updateProduct(id, data)
        res.send(product)

    } catch (error) {
        res.status(500).send("Error al intentar actualizar el producto: " + err)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const prodDeleted = await productManager.deleteProduct(id)
        res.send(prodDeleted)

    } catch (error) {
        res.status(500).send("Error al intentar eliminar el producto: " + err)
    }

})

export default router