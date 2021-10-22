const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const authRoutes = require('./routes/auth');
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('615c888e54aa05f8e2e08ab2')
        req.user = user
        next()
    } catch (err) {
        console.log(err)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        const password = 'XF1mNsJwLse9RJtt';
        const url = `mongodb+srv://tagiltsef:${password}@cluster0.bpkhs.mongodb.net/shop`;
        await mongoose.connect(url, {useNewUrlParser: true})

        const candidate = await User.findOne()

        if (!candidate) {
            const user = new User({
                email: 'pavel.tagiltsef@gmail.com',
                name: 'tagiltsef',
                cart: {items: []}
            })

            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port${PORT}`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()




