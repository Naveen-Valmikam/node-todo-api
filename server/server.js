var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
app.use(bodyParser.json());

const port = process.env.PORT||3000;

app.post('/todos',(req,res)=>{
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(err)=>{
    res.status(400).send(err);
  });
});


// GET todos/123456
app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo)=>{
      if(!todo){
         return res.status(404).send();
      }
      res.send({todo});
  }).catch((e)=>{
    return res.status(400).send();
  });
});

app.delete('/todos/:id',(req,res)=>{
  // get the id
  var id= req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send({message:'Invalid Todo Id passed.'});
  }

  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.status(404).send({message:'Todo not found.'});
    }
    res.send(todo);
  }).catch((e)=>{
    return res.status(400).send({message:'Error happened while deleting todo.'});
  });
  });


app.listen(port,()=>{
  console.log(`Started on port :${port}`);
});

module.exports ={app};
