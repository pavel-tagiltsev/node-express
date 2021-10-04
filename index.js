const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cartRouter = require('./routes/cart')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRouter)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        const password = 'XF1mNsJwLse9RJtt';
        const url = `mongodb+srv://tagiltsef:${password}@cluster0.bpkhs.mongodb.net/shop`;
        await mongoose.connect(url, {useNewUrlParser: true})

        app.listen(PORT, () => {
            console.log(`Server is running on port${PORT}`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()




