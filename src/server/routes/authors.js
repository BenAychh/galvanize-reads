var express = require('express');
var router = express.Router();
var queries = require('./queries.js');

router.get('/', function(req, res, next) {
  queries.getAuthors()
  .then(function(authors) {
    var params = {
      authors: authors,
      stylesheet: 'books.css',
    }
    res.render('authors', params);
  })
});
router.get('/new', function(req, res, next) {
  queries.getBooks()
  .then(function(books) {
    var params = {
      stylesheet: 'newandedit.css',
      books: books,
      currentBooks: [],
    }
    res.render('newandeditauthor', params)
  });
});
router.post('/new', function(req, res, next) {
  queries.addAuthor(req.body)
  .then(function(authorId) {
    res.redirect('/authors/' + authorId);
  })
})

router.get('/:id', function(req, res, next) {
  queries.getAuthors({id: req.params.id})
  .then(function(authors) {
    var params = {
      authors: authors,
      stylesheet: 'books.css',
    }
    res.render('authors', params);
  });
});
router.post('/new', function(req, res, next) {
  queries.addBook(req.body)
  .then(function(bookId) {
    console.log(bookId);
    res.redirect('/books/' + bookId);
  })
});
router.get('/:id/edit', function(req, res, next) {
  var promises = [];
  promises.push(queries.getBooks());
  promises.push(queries.getAuthors({id: req.params.id}));
  promises.push(queries.getBookTitlesByAuthor(req.params.id));
  Promise.all(promises)
  .then(function(results) {
    var params = {
      books: results[0],
      author: results[1][0],
      currentBooks: results[2].reduce(function(prev, current) {
        prev.push(current.id);
        return prev;
      }, []),
    }
    res.render('newandeditauthor', params);
  })
});
router.post('/:id/edit', function(req, res, next) {
  queries.updateAuthor(req.params.id, req.body)
  .then(function() {
    res.redirect('/authors/' + req.params.id);
  })
  .catch(function(err) {
    console.log(err);
  });
});
router.get('/:id/delete', function(req, res, next) {
  queries.getAuthors({id: req.params.id})
  .then(function(authors) {
    var params = {
      authors: authors,
      stylesheet: 'authors.css',
      del: true,
    }
    res.render('authors', params);
  });
});
router.get('/:id/delete/confirm', function(req, res, next) {
  queries.deleteAuthor(req.params.id)
  .then(function() {
    res.redirect('/authors/')
  })
})
module.exports = router;
