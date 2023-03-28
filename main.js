const { response, request } = require('express')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()
app.use(express.json()) //usar na aplicação o formato JSON

//Nodemon -> (lib) ferramenta/dependencia de desenvolvimento para monitorar o código e atualizando as mundanças. Usar --save-dev para a dependencia não ir para produção. 
//Para rodar -> npx nodemon nome do arquivo
//script-> server: nodemon main.js

let tasks = []

//listar todas as tarefas
app.get('/', (request, response) => {
    response.send("<h1 style= 'color:red'> Mostrar no insomnia!!! </h1> ")
   //response.redirect("https://www.npmjs.com/package/nodemon")
})

app.get('/tasks', (request, response) => {   
   response.json( tasks)
})

//cadastrar uma tarefa
app.post('/tasks', (request, response) => {
    console.log(request.body);
    //console.log(request.body.title);

    //BODY
    //sempre tratar o body, usar apenas as chaves q são necessárias para não receber um script 
    //malicioso
    const task = {
        id: uuidv4(),
        title : request.body.title,
        description: request.body.description,
        limit_date: request.body.limit_date,
        status: false,
        created_at: new Date().toLocaleDateString('pt-BR')
    }
    tasks.push(task)  
    
    response.status(201).json(task)
})

//route params
//deletar uma tarefa
app.delete('/tasks/:id', (request, response) => {
    const tasksFiltered = tasks.filter(task => task.id != request.params.id)
    tasks = [ ... tasksFiltered]//spread - faz uma cópia do array original
    response.json()
})

//buscar uma tarefa
app.get('/tasks/:id', (request, response) => {
    console.log(request.params);
    const task =  tasks.find( task => task.id == request.params.id)//find retorna o primeiro objeto q ele encontrar
    
    if(!task) {
        return response.status(404).json({error: 'Desculpa, esse item não foi encontrado!'})
    }
    response.json(task)
})

//atualizar uma tarefa não concluída
app.put('/tasks/:id', (request, response) => {

    const task = tasks.find( task => task.id == request.params.id)
    if (!task) {
        return response.status(404).json({error: 'Desculpa, não encontramos essa tarefa!'})
    }
    if (task.status) {
        return response.status(401).json({error: 'Não é permitido atualizar uma tarefa concluída!'})
    }
    const newTasks = tasks.map( task => {
    if (task.id == request.params.id) {
        task.title = request.body.title
        task.description = request.body.description
        task.limit_date = request.body.limit_date  
        task.status = true      
    }
    return task    
})  
    tasks = [... newTasks]    
    response.json()  //como é a última instrução não precisa dar o return 
})

//atualizar o status da tarefa
app.patch('/tasks/:id/active', (request, response) => {

    const task = tasks.find( task => task.id == request.params.id)
    if(!task) {
        return response.status(404).json({error:'Desculpa, não encontramos essa tarefa!'})
    }

    const taskStatus = tasks.map( task => {
        if ( task.id == request.params.id) {
           task.status = true
        }
        return task
    })

    tasks = [ ...taskStatus]

    response.json()

})


app.listen(3333, () => {
    console.log('Servidor online!')
})