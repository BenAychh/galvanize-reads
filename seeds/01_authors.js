var seeder = require('knex-csv-seeder').seeder.seed;
exports.seed = seeder({
  table: 'authors',
  file: './seeds/csv/authors.csv',
});
