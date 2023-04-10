import { Router } from "express"
import { v4 as uuidv4} from 'uuid'
import * as yup from 'yup'

export const tasksRoutes = Router()

let tasks = []

//pesquisar tarefa
tasksRoutes.get('/tasks', (request, response) => {   
    // console.log(request.query.title);
    const titleQuery = request.query.title || ""
    const descriptionQuery = request.query.description || ""
     
     const tasksSearch  = tasks.filter(
         task => task.title.toUpperCase().includes(titleQuery.toUpperCase())
         && 
         task.description.toUpperCase().includes(descriptionQuery.toUpperCase())
         )
 
     return response.json(tasksSearch)
 })
 
 //cadastrar uma tarefa
 tasksRoutes.post('/tasks', async (request, response) => {
    //console.log(request.body);
     //BODY - sempre tratar o body, usar apenas as chaves q são necessárias para não receber um script 
     //malicioso
 
     try {
         const schema = yup.object().shape({
             title: yup.string().min(5,"Título deve conter no mínimo 5 caracteres.").max(100).required("Título é obrigatório!"),
             description: yup.string().min(10, "Descrição deve conter no mínimo 10 caracteres.").max(250).required("Descrição é obrigatória!"),
             limit_date: yup.string()
         })
         
         await schema.validate(request.body)
 
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
     } catch (error) {
         response.status(400).json({error: error.message})        
     }
 })
 
 //route params
 //deletar uma tarefa
 tasksRoutes.delete('/tasks/:id', (request, response) => {
     const tasksFiltered = tasks.filter(task => task.id != request.params.id)
     tasks = [ ... tasksFiltered]//spread - faz uma cópia do array original
     response.json()
 })
 
 //buscar uma tarefa
 tasksRoutes.get('/tasks/:id', (request, response) => {
     console.log(request.params);
     const task =  tasks.find( task => task.id == request.params.id)//find retorna o primeiro objeto q ele encontrar
     
     if(!task) {
         return response.status(404).json({error: 'Desculpa, esse item não foi encontrado!'})
     }
     response.json(task)
 })
 
 //atualizar uma tarefa não concluída
 tasksRoutes.put('/tasks/:id', (request, response) => {
 
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
 tasksRoutes.patch('/tasks/:id/active', (request, response) => {
 
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