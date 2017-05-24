const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5924e095e377483ce8effbb4';

User.findById(id).then((user)=>{
  if(!user){
      return console.log('Id not found');
  }
  console.log(JSON.stringify(user,undefined,2));
},(err)=>{
  console.log(e);
});
