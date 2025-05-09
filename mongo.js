const { default: mongoose } = require('mongoose');
const mongo = require('mongoose');


if (process.argv.length < 3) {
    console.log('arguments not provided');
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://jesushdzusa:${password}@cluster0.mlhoaip.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set('strictQuery', false);

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
    //id: Number,
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema);

const contact = new Contact({
    //id: Math.floor(Math.random() * 100000),
    name: name,
    number: number,
})

if (!name || !number) {
    Contact.find({}).then(persons => {
        persons.forEach(person => {
            console.log("phonebook: ")
            console.log(person.name, person.number)
              
        })
        mongoose.connection.close()
    })
    
}
else {
    contact.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
/*

})
*/