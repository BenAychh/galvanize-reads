var express = require('express');
var router = express.Router();
var queries = require('./queries.js');

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
router.get('/new', function(req, res, next) {
  queries.getAuthors()
  .then(function(authors) {
    var params = {
      stylesheet: 'newandeditbook.css',
      authors: authors,
      currentAuthors: [],
    }
    res.render('newandedit', params)
  });
});
router.post('/new', function(req, res, next) {
  queries.addBook(req.body)
  .then(function(bookId) {
    console.log(bookId);
    res.redirect('/books/' + bookId);
  })
})
router.get('/:id/edit', function(req, res, next) {
  var promises = [];
  promises.push(queries.getBooks({id: req.params.id}));
  promises.push(queries.getAuthors());
  promises.push(queries.getAuthorNamesByBook(req.params.id));
  Promise.all(promises)
  .then(function(results) {
    var params = getBooks(results[0][0], 'newandedit.css');
    params['authors'] = results[1];
    params['currentAuthors'] = results[2].reduce(function(prev, current) {
      prev.push(current.id);
      return prev;
    }, []);
    res.render('newandedit', params)
  })
});

router.post('/:id/edit', function(req, res, next) {
  queries.updateBook(req.params.id, req.body)
  .then(function() {
    res.redirect('/books/' + req.params.id);
  });
});
router.get('/:id/delete', function(req, res, next) {
  queries.getBooks({id: req.params.id})
  .then(function(books) {
    var params = getBooks(books, 'books.css');
    params['del'] = true;
    console.log(params);
    res.render('books', params);
  });
});
router.get('/:id/delete/confirm', function(req, res, next) {
  queries.deleteBook(req.params.id)
  .then(function() {
    res.redirect('/books/')
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
