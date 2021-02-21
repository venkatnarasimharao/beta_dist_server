// For testing of migration files
// Use this knex file to test the migration files that you've created

const DatabaseCredentials = {
    client: "mysql",
    connection: {
        host: "localhost",
        user: "root",
        password: "BaCaTa@2020",
        database: "bacata_uat",
        charset: "utf8"
    },
    debug: false,
    migrations: {
        directory: '../migrations'
    },
    seeds: {
        directory: '../seeds'
    }
};

module.exports = DatabaseCredentials;

/*
    to make file
  knex --knexfile=.\knexGenerator.js seed:make fileName
    TO generate migration tables (tables creation)
  knex --knexfile=.\knexGenerator.js migrate:latest
    To delete migrate tables
  // knex --knexfile=.\knexGenerator.js migrate:rollback

  Seeds - data insertion
  knex --knexfile=.\knexGenerator.js seed:make fileName
    To generate data
  // knex --knexfile=.\knexGenerator.js seed:run
*/