const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


let url = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MONGODB')
    })
    .catch(error => {
        console.log("error connecting to MONGODB: ", error.message)
    })



const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function (v) {
                return /\d{3}-\d{7}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`,
        },
        required: [true, 'User phone number required']
    }
});

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact