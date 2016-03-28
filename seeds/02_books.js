var seeder = require('knex-csv-seeder').seeder.seed;
exports.seed = seeder({
  table: 'books',
  file: './seeds/csv/books.csv',
});
