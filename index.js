const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
//const mysql = require('mysql')

const User = require('./model/User')

const app = express()

app.use(
  express.urlencoded({
    extended:true,
  }),
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// CRIAÇÃO DE USUARIOS DO NOSSO SISTEMA

app.get("/user/create", (req,res) => {
  res.render('adduser')
})

app.post('/user/create', async (req,res) =>{

  const name = req.body.name
  const occupation = req.body.occupation
  let newsletter = req.body.newsletter

  if(newsletter === 'on') {
    newsletter = true
  } else{
    newsletter = false
  }
 
  await User.create({name, occupation, newsletter})

  res.redirect('/')

})

//PAGINA INICIAL DO SITE

app.get('/', async (req,res) => {

  const users = await User.findAll({raw: true})

    res.render('home', {users})
})


//VISUALIZAR INFOR DOS USERS.

app.get("/user/:id", async (req,res)=>{
  const userId = req.params.id
  const user = await User.findOne({ raw: true, where: {id:userId} })
  
  res.render('userviews', { user })
})

//DELETAR UM USUARIO

app.post('/user/delete/:id', async (req,res) => {

  const id = req.params.id

  await User.destroy({ where: {id:id} })

  res.redirect('/')

}) 

//EDITAR PERFIL DO USUARIO
app.get('/user/edit/:id',async (req,res) => {
  
  const id = req.params.id
  
  const user = await User.findOne({raw: true, where: {id:id} })

  res.render('edituser', {user})

})

app.post('/user/update', async (req,res) => {
  const id = req.body.id
  const name = req.body.name
  const occupation = req.body.occupation
  let newsletter = req.body.newsletter

  if(newsletter === 'on') {
    newsletter = true
  } else{
    newsletter = false
  }
  
  
  const userData = {
    id,
    name,
    occupation,
    newsletter,
  }
  console.log(userData)
  await User.update(userData, {where: {id:id}})
  
  res.redirect('/')
})

conn.sync().then(()=>{
  app.listen(3000)
}).catch((err) => console.log(err))