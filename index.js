const express = require('express')
const app = express()
var morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

let phonebook =[{
    id : 1,
    name : "a",
    number:"1234567890"
},
{
    id : 2,
    name : "b",
    number:"2583691470"
}];

app.get('/',(req,res) => {
    res.send('<h1>Welcome to PhoneBook!</h1>')
});

app.get('/api/persons/get/all',(req,res) => {
    res.json(phonebook);
});

app.get('/api/persons/info',(req,resp) => {
    var size = phonebook.length;
    resp.writeHead(200, { 'Content-Type': 'text/html' });
    resp.write('<p>There are '+size+' no of people </p><br /><br />Date : ' + new Date());
    resp.end();
});

app.get('/api/persons/get/:id',(req,res) => {
    const val = Number(req.params.id);
    const filteredPerson = phonebook.find(ph => ph.id === val);
    console.log(filteredPerson);
    if(filteredPerson){
        res.json(filteredPerson);
    }else{
        res.status(404).end();
    }
});

function getMaxId(){
    const maxId = phonebook.length > 0
    ? Math.max(...phonebook.map(n => n.id)) 
    : 0
    return maxId;
}

app.post('/api/persons/post', (request, response) => {
    const person = request.body
    console.log(person)
    var newPhBook = {
        id: getMaxId(),
        name: person.name,
        number: person.number
    }
    phonebook = phonebook.concat(newPhBook);
    response.json(newPhBook)
  })

app.delete('/api/persons/delete/:id',(request,response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(ph => ph.id !== id)
    console.log(phonebook);
    response.status(204).end()
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})