const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/phonebook');


app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



let infoPage = (contacts) => {
    return `<div> 
                <p>Phonebook has info for ${contacts.length} people</p> 
                <p>${Date()}</p>
            </div>`;

}

let PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

app.get("/", (request, response) => {
    response.send('<h1>API persons</h1>')
})

app.get("/api/persons", (request, response) => {
    Contact.find({}).then(persons => {
        response.send(persons)

    })

})

app.get("/info", (request, response) => {
    Contact.find({}).then(persons => {
        let info = infoPage(persons)
        response.send(info)

    })

})

app.get("/api/persons/:id", (request, response, next) => {
    let id = request.params.id;
    Contact.findById(id)
        .then(person => {
            response.send(person)
        })
        .catch(error => next(error))
    /*
    let personFound = persons.find(person => person.id === id)
    if (personFound) {
        console.log(personFound)
        response.send(personFound)
    } else response.status(404).end()*/
})

app.delete("/api/persons/:id", (request, response, next) => {
    let id = request.params.id;
    Contact.findByIdAndDelete(id).then(result => {
        console.log(result)
        response.status(204).end();

    })
        .catch(error => next(error))
    //persons = persons.filter(person => person.id !== id);

})

app.put("/api/persons/:id", (request, response, next) => {
    const { number } = request.body
    Contact.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }
            person.number = number;
            return person.save().then((personUpdated) => {
                response.json(personUpdated)
            })
        })
        .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    //let id = persons.length>0?Math.max(...persons.map(person=>Number(person.id))):0;
    let name = request.body.name;
    Contact.findOne({ name: name }).then(result => {
        if (result) {
            console.log(result.name)
            console.log(result.number)
            return response.status(400).json({ error: "name must be unique" });
        } else {
            console.log(result)
            let newPerson = new Contact({
                name: request.body.name,
                number: request.body.number
            })
            newPerson.save().then(result => {
                response.send(result)
            })

        }
    })
    .catch(error => next(error))


    /*
    let id = Math.floor(Math.random() * 1000000);
    let nameFound = persons.find(person => person.name === request.body.name);
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({ error: "missing information" })
    }
    else if (nameFound) {
        return response.status(400).json({ error: "name must be unique" });
    }
    let newPerson = {
        id: String(id),
        name: request.body.name,
        number: request.body.number
    }

    persons = persons.concat(newPerson)
    console.log(persons)
    response.json(newPerson)*/
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(errorHandler)