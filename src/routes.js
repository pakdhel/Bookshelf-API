const {
  addBookHandler, getAllBooksHandler, getDetailBook, editBook, deleteBook,
} = require('./handler');

const routes = [{
  method: 'POST',
  path: '/books',
  handler: addBookHandler,
}, {
  method: 'GET',
  path: '/books',
  handler: getAllBooksHandler,
}, {
  method: 'GET',
  path: '/books/{bookId}',
  handler: getDetailBook,
}, {
  method: 'PUT',
  path: '/books/{bookId}',
  handler: editBook,
}, {
  method: 'DELETE',
  path: '/books/{bookId}',
  handler: deleteBook,
}];

module.exports = routes;
