const  MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDb server');
  }
  console.log('Connected to MongoDb server');

  db.collection('Todos').insertOne({
    text:'Something to do',
    completed :false
  },(err, result)=>{
    if(err){
      return console.log('Unable to insert Todo', err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));

  });

  db.collection('Users').insertOne({
    name:'Naveen Valmikam',
    age:25,
    location:'Melbourne'
  },(error,result)=>{
    if(error){
      return console.log('Unable to insert user',error);
    }
    console.log(result.ops[0]._id.getTimestamp());
  });

  db.close();
});
