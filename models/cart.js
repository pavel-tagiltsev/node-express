const path = require('path')
const fs = require('fs')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
)

class Cart {
    static async add(course) {
        const cart = await Cart.fetch()

        const index = cart.courses.findIndex((item) => item.id === course.id)
        const candidate = cart.courses[index]
            console.log(cart.courses[index])
        if (candidate) {
            // курс уже есть
            candidate.count++
            cart.courses[index] = candidate
            console.log(candidate)
        } else {
            // нужно добавить
            course.count = 1
            cart.courses.push(course)
            console.log(course)
        }

        cart.price += +course.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async remove(id) {
        const cart = await Cart.fetch()

        const index = cart.courses.findIndex((item) => item.id === id)
        const course = cart.courses[index]

        if (course.count === 1) {
            // удалить
            cart.courses = cart.courses.filter((item) => item.id !== id)
        } else {
            // изменить количество
            cart.courses[index].count--
        }

        cart.price -= course.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(cart)
                }
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })
        })
    }
}

module.exports = Cart