const mongoose = require('mongoose');

let url = process.env.MONGODB_URI
mongoose.set('strictQuery',false);
mongoose.connect(url)
.then(result=>{
    console.log('connected to MONGODB')
})
.catch(error=>{
    console.log("error connecting to MONGODB: ",error.message)
})

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

contactSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Contact = mongoose.model('Contact',contactSchema);

module.exports= Contact