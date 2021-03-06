exports.up = function(knex) {
    try {
        return knex.schema
            .createTableIfNotExists('user_bank_details', (table) => {
                table.increments('bank_id ');
                table.string('bank_name', 100).defaultTo(null);
                table.string('branch_name', 100).defaultTo(null);
                table.string('account_no', 100).defaultTo(null);
                table.string('ifsc_code', 100).defaultTo(null);
                table.integer('user_id ').defaultTo(null).unique();
                table.tinyint('status', 1).defaultTo(1);
                table.datetime('created_at').defaultTo(knex.fn.now());
                table.timestamp('updated_at').defaultTo(knex.fn.now());
            });
    } catch (err) {
        console.log(err, 'error in migrations')
        exports.down();
    }
};

exports.down = function(knex) {
    return knex
    .raw("SET foreign_key_checks = 0;")
    .then(() => knex.schema
        .dropTableIfExists('user_bank_details')
    )
    .finally(() => knex.raw("SET foreign_key_checks = 1;"));
};
