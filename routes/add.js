const {Router} = require('express')
const Course = require('../models/course')
const router = Router()
const checkUrl = require('../helpers/utils')

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    const {title, price, img} = req.body

    const course = new Course({
        title,
        price,
        img: checkUrl(img),
        userId: req.user._id
    })

    try {
        await course.save()

        res.redirect('/courses')
    } catch (err) {
        console.log(err)
    }
})

module.exports = router