const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const authRoutes = require('./routes/auth');
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const DB_PASSWORD = 'XF1mNsJwLse9RJtt'
const MONGODB_URL = `mongodb+srv://tagiltsef:${DB_PASSWORD}@cluster0.bpkhs.mongodb.net/shop`;

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
  
const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URL
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(MONGODB_URL, {useNewUrlParser: true})

        // const candidate = await User.findOne()

        // if (!candidate) {
        //     const user = new User({
        //         email: 'pavel.tagiltsef@gmail.com',
        //         name: 'tagiltsef',
        //         cart: {items: []}
        //     })

        //     await user.save()
        // }

        app.listen(PORT, () => {
            console.log(`Server is running on port${PORT}`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()




