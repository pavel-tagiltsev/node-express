const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

function mapCartItems(cart) {
    return cart.items.map((item) => ({
        ...item.courseId._doc, count: item.count
    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/cart')
})

router.delete('/remove/:id', async (req, res) => {
    const cart = await Cart.remove(req.params.id)
    res.status(200).json(cart)
})

router.get('/', async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId');
    
    const courses = mapCartItems(user.cart)

    res.render('cart', {
        title: 'Корзина',
        isCart: true,
        courses,
        price: computePrice(courses)
    })
})

module.exports = router