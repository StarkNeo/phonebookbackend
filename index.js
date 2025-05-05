const express=require('express');
const app=express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());

app.use(express.json());
//app.use(morgan('tiny'));

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons =[
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

let infoPage =`<div> 
                <p>Phonebook has info for ${persons.length} people</p> 
                <p>${Date()}</p>
                </div>`;


let PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})

app.get("/",(request, response)=>{
    response.send('<h1>API persons</h1>')
})

app.get("/api/persons",(request, response)=>{
    response.send(persons)
})

app.get("/info",(request,response)=>{
    response.send(infoPage)
})

app.get("/api/persons/:id",(request, response)=>{
    let id = request.params.id;
    let personFound = persons.find(person=>person.id===id)
    if(personFound){
        console.log(personFound)
        response.send(personFound)
    } else response.status(404).end()
})

app.delete("/api/persons/:id",(request,response)=>{
    let id=request.params.id;
    persons = persons.filter(person=>person.id !== id);
    response.status(204).end();
})

app.post("/api/persons",(request, response)=>{
    //let id = persons.length>0?Math.max(...persons.map(person=>Number(person.id))):0;
    let id = Math.floor(Math.random()*1000000);
    let nameFound = persons.find(person=>person.name===request.body.name);
    if(!request.body.name || !request.body.number){
        return response.status(400).json({error:"missing information"})
    }
    else if(nameFound){
        return response.status(400).json({error:"name must be unique"});
    }
    let newPerson = {
        id:String(id),
        name:request.body.name,
        number:request.body.number
    }

    persons = persons.concat(newPerson)
    console.log(persons)
    response.json(newPerson)
})

