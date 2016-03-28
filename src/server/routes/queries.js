var knex = require('../../../db/knex.js');
function Books() {
  return knex('books');
}
function Authors() {
  return knex('authors');
}

function getBooks(params) {
  if (params) {
    return Books().where(params)
    .then(function(books) {
      return attachAuthorsToBooks(books);
    })
  }
  return Books()
  .then(function(books) {
    return attachAuthorsToBooks(books);
  });
}
function attachAuthorsToBooks(books) {
  return knex.raw('select * from authors inner join book_author '
    + 'on book_author.author_id = authors.id')
  .then(function(authors) {
    var returner = [];
    books.forEach(function(book) {
      var first = true;
      var i = 0;
      for (var i = 0; i < authors.length; i++) {
        if (book.id === authors[i].book_id) {
          var fullName = authors[i].first_name + ' ' + authors[i].last_name;
          if (first) {
            book['authors'] = fullName;
            first = false;
          } else {
            book.authors += ' & ' + fullName;
          }
          authors.splice(i, 1);
          // Since we splice out, we need to repeat the current counter.
          i--;
        }
      }
      returner.push(book);
    });
    return returner;
  })
}
function getAuthors(params) {
  if (params) {
    return Authors().where(params);
  }
  return Authors()
}
function getAuthorNamesByBook(bookId) {
  return knex.raw('select authors.id from authors '
	+ 'inner join book_author on book_author.author_id = authors.id '
	+ 'inner join books on books.id = book_author.book_id '
  + 'where books.id = ' + bookId)
  .then(function(rawResults) {
    return rawResults.rows;
  })
  .catch(function(err) {
    console.log(err);
  })
}

module.exports = {
  getBooks,
  getAuthors,
  getAuthorNamesByBook,
}
