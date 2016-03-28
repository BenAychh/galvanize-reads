var seeder = require('knex-csv-seeder').seeder.seed;
exports.seed = seeder({
  table: 'book_author',
  file: './seeds/csv/books-authors.csv',
});
