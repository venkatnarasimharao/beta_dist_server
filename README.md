#   bacatastore
#   ----------------to create migrate file for table-----------
###   knex --knexfile=./src/config/knexConfig.js migrate:make <table name>

#   ----------------to run migrate files for table--------------
###   knex --knexfile=./src/config/knexGenerator.js migrate:rollback
###   knex --knexfile=./src/config/knexGenerator.js migrate:latest