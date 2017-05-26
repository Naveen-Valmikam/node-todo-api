const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos=[{
  _id:new ObjectID(),
  text:'Learn Node.js'
}, {
  _id:new ObjectID(),
  text:'Practice Node',
  completed:true,
  completedAt:333
}];



beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
});

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((err)=> done(err));
    });
  });

  it('should not create todo with invalid data',(done)=>{
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((err)=>done(err));
    });
  });
});

describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/id',()=>{
  it('should return todo doc',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found',(done)=>{
    // make sure 404 is returned back
    var newId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${newId}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids',(done)=>{
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos',()=>{
  it('should remove a todo',(done)=>{
    var id = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(id);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(id).then((todo)=>{
        expect(todo).toNotExist();
        done();
      }).catch((e)=> done(e));
    });
  });

  it('should return 404 if todo not found',(done)=>{
    // make sure 404 is returned back
    var newId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${newId}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids',(done)=>{
    request(app)
    .delete('/todos/123')
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id',()=>{
  it('should update a given todo.',(done)=>{
      var id = todos[0]._id.toHexString();
      var text = 'New text for the todo';

      request(app)
      .patch(`/todos/${id}`)
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed',(done)=>{
    var id= todos[1]._id.toHexString();

    request(app)
    .patch(`/todos/${id}`)
    .send({
      completed:false
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });

  it('should return 404 if todo not found',(done)=>{
    // make sure 404 is returned back
    var newId = new ObjectID().toHexString();
    request(app)
    .patch(`/todos/${newId}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids',(done)=>{
    request(app)
    .patch('/todos/123')
    .expect(404)
    .end(done);
  });

});
