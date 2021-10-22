const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }

})

userSchema.methods.addToCart = function(course) {
    const clonedItems = [...this.cart.items]
    const index = clonedItems.findIndex((item) => {
        return item.courseId.toString() === course._id.toString()
    })

    if (index >= 0) {
        clonedItems[index].count = clonedItems[index].count + 1
    } else {
        clonedItems.push({
            courseId: course._id,
            count: 1
        })
    }

    const newCart = {items: clonedItems}
    this.cart = newCart
    return this.save()
}

userSchema.methods.removeFromCart = function(id) {
    let clonedItems = [...this.cart.items]
    const index = clonedItems.findIndex((item) => item.courseId.toString() === id.toString())
    
    if (clonedItems[index].count === 1) {
        clonedItems = clonedItems.filter((item) => item.courseId.toString() !== id.toString())
    } else {
        clonedItems[index].count--
    }
    const newCart = {items: clonedItems}
    this.cart = newCart
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', userSchema)