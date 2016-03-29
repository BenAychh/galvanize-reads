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

module.exports = router;
