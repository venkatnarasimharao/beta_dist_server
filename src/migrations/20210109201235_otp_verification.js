exports.up = function (knex) {
    try {
        return knex.schema
            .createTableIfNotExists('otp_verification', (table) => {
                table.increments('otp_id');
                table.string('email', 50).defaultTo(null).unique();
                table.string('otp_code', 50).defaultTo(null);
                table.integer('status').defaultTo(1);
                table.timestamp('created_at').defaultTo(knex.fn.now());
                table.timestamp('updated_at').defaultTo(knex.fn.now());
            });
    } catch (err) {
        console.log(err, 'error in migrations')
        exports.down();
    }
};

exports.down = function (knex) {
    return knex
        .raw("SET foreign_key_checks = 0;")
        .then(() => knex.schema
            .dropTableIfExists('otp_verification')
        )
        .finally(() => knex.raw("SET foreign_key_checks = 1;"));
};