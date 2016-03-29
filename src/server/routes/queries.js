var knex = require('../../../db/knex.js');
function Books() {
  return knex('books');
}
function Authors() {
  return knex('authors');
}
function BooksAndAuthors() {
  return knex('book_author');
}

function getBooks(params) {
  var query = 'select books.id, books.title, books.genre, books.description, '
  + 'books.cover_url, '
  + 'array_agg(authors.first_name || \''
  +  '\' || authors.last_name || \',\' || authors.id) '
  + 'as authors from books '
  + 'inner join book_author on book_author.book_id = books.id ';
  if (!params) {
    query += 'inner join authors on book_author.author_id = authors.id';
  } else {
    query += 'inner join authors on book_author.author_id = authors.id where ';
    var keys = Object.keys(params);
    keys.forEach(function(key) {
      query += 'books.' + key + ' = ';
      if (isNaN(params[key])) {
        query += '\'' + params[key] + '\' AND ';
      } else {
        query += params[key] + ' AND ';
      }
    })
    query = query.substring(0, query.length - 4);
  }
  query += ' group by books.id, books.title, books.genre, ' +
  'books.description, books.cover_url order by books.id';
  return knex.raw(query)
  .then(function(rawResults) {
    var returner = [];
    rawResults.rows.forEach(function(book) {
      var authorArrayInBook = [];
      book.authors.forEach(function(author) {
        var authorArray = author.split(',');
        authorArrayInBook.push({name: authorArray[0], id: authorArray[1]});
      });
      book.authors = authorArrayInBook
      returner.push(book);
    });
    return returner;
  })
}
function updateBook(bookId, formData) {
  var promises = [];
  if (!Array.isArray(formData.authors)) {
    formData.authors = [formData.authors];
  }
  promises.push(updateAuthors(bookId, formData.authors));
  delete formData.authors;
  promises.push(Books().where({id: bookId}).update(formData));
  return Promise.all(promises);
}
function addBook(formData) {
  var authors = formData.authors;
  if (!Array.isArray(authors)) {
    authors = [authors];
  }
  delete formData.authors;
  return Books().insert(formData, 'id')
  .then(function(bookId) {
    return updateAuthors(Number(bookId), authors)
    .then(function() {
      return Number(bookId);
    });
  });
}
function getAuthors(params) {
  if (params) {
    return Authors().where(params);
  }
  return Authors()
}
function deleteBook(bookId) {
  return Books().where({id: bookId}).del();
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
function updateAuthors(bookId, arrayOfAuthors) {
  return BooksAndAuthors().where({book_id: bookId}).del()
  .then(function() {
    var rows = [];
    arrayOfAuthors.forEach(function(authorId) {
      rows.push({
        book_id: bookId,
        author_id: Number(authorId),
      })
    })
    return knex.batchInsert('book_author', rows, 1000)
  })
}
function getAuthors(params) {
  var query = 'select authors.id, authors.first_name, authors.last_name, '
  + ' authors.biography, authors.portrait_url, '
  + ' array_agg(books.title || \',\' || books.id) as books from books '
	+ ' inner join book_author on book_author.book_id = books.id ';
  if (!params) {
    query += 'inner join authors on book_author.author_id = authors.id';
  } else {
    query += 'inner join authors on book_author.author_id = authors.id where ';
    var keys = Object.keys(params);
    keys.forEach(function(key) {
      query += 'authors.' + key + ' = ';
      if (isNaN(params[key])) {
        query += '\'' + params[key] + '\' AND ';
      } else {
        query += params[key] + ' AND ';
      }
    })
    query = query.substring(0, query.length - 4);
  }
  query += ' group by authors.id; '
  console.log(query);
  return knex.raw(query)
  .then(function(rawResults) {
    var returner = [];
    rawResults.rows.forEach(function(author) {
      var bookArrayInAuthors = [];
      author.books.forEach(function(book) {
        var bookArray = book.split(',');
        bookArrayInAuthors.push({title: bookArray[0], id: bookArray[1]});
      });
      author.books = bookArrayInAuthors;
      returner.push(author);
    });
    return returner;
  })
}

module.exports = {
  getBooks,
  updateBook,
  getAuthors,
  getAuthorNamesByBook,
  addBook,
  deleteBook,
  getAuthors,
}
