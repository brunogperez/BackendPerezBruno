const fs = require('fs')
const filename = './db.json'
const crypto = require('crypto')

class UserManager {

    getUsers = async () => {

        try {
            const DB = await fs.promises.readFile(filename, 'utf-8')
            return JSON.parse(DB)
        } catch (e) {
            console.log('No encontro el archivo, se devuelve []')
            return []
        }
    }

    insertUser = async (user) => {

        const DB = await this.getUsers()
        user.id = DB.length + 1

        user.salt = crypto.randomBytes(128).toString('base64')
        user.password = crypto.createHmac('sha256', user.salt).update(user.password).digest('hex')

        DB.push(user)
        await fs.promises.writeFile(filename, JSON.stringify(DB))

    }

    validateUser = async (username, password) => {

        const DB = await this.getUsers()
        const user = DB.find( u => u.username == username )

        if (!user) {
            console.log('User not found')
            return
        }

        const newHash = crypto.createHmac('sha256', user.salt).update(password).digest('hex')

        if (newHash == user.password) console.log('Logged!')
        else console.log('Invalid pass')
    }
}
async function run() {

 const manager = new UserManager()
await manager.insertUser({
        name: 'Bruno', lastname: 'Perez', username: 'brunogperez', password: '123456'
    })

    console.log(await manager.getUsers())

    await manager.validateUser('brunogperez', '123456')


}

run()

