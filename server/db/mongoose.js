var mongoose = require('mongoose');
let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://NaveenValmikam:ILoveCoding123$@ds153521.mlab.com:53521/todo-app-api'
};
mongoose.connect( process.env.PORT ? db.mlab : db.localhost);

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
