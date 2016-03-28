module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/galvanize_reads_ben_hernandez'
  },

  production: {
    client: 'pg',
    connection: 'postgres://'
  }
};
