
exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table) {
    table.increments();
    table.string('title');
    table.string('genre');
    table.text('description');
    table.string('cover_url', 1024);
  })
  .then(function() {
    return knex.schema.createTable('authors', function(table) {
      table.increments();
      table.string('first_name');
      table.string('last_name');
      table.text('biography');
      table.string('portrait_url', 1024);
    });
  })
  .then(function() {
    return knex.schema.createTable('book_author', function(table) {
      table.integer('author_id').references('id').inTable('authors');
      table.integer('book_id').references('id').inTable('books');
    });
  })
};

exports.down = function(knex, Promise) {

};
