import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './src/public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const storageMulter = multer({storage})