var mongoose = require('mongoose');
// let db = {
//   localhost: 'mongodb://localhost:27017/TodoApp',
//   mlab: 'mongodb://testuser:password1@ds153521.mlab.com:53521/todo-app-api'
// };
mongoose.connect( process.env.MONGODB_URI||'mongodb://localhost:27017/TodoApp');

mongoose.Promise = global.Promise;

module.exports = {mongoose};
