var express = require('express');
var router = express.Router();
var queries = require('../queries.js');

router.get('/', function(req, res, next) {
  queries.getBooks()
  .then(function(books) {
    res.render('books', getBooks(books, 'books.css'));
  })
});
router.get('/:id', function(req, res, next) {
  queries.getBooks({id: req.params.id})
  .then(function(books) {
    res.render('books', getBooks(books, 'books.css'));
  });
});
router.get('/:id/edit', function(req, res, next) {
  var promises = [];
  promises.push(queries.getBooks({id: req.params.id}));
  promises.push(queries.getAuthors());
  promises.push(queries.getAuthorNamesByBook(req.params.id));
  Promise.all(promises)
  .then(function(results) {
    var params = getBooks(results[0][0], 'newandeditbook.css');
    params['authors'] = results[1];
    params['currentAuthors'] = results[2].reduce(function(prev, current) {
      prev.push(current.id);
      return prev;
    }, []);
    res.render('newandeditbook', params)
  })
})
function getBooks(books, stylesheet) {
  var params = {
    books: books,
    stylesheet: stylesheet,
  }
  return params
}

module.exports = router;
