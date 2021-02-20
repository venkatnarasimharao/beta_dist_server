exports.up = function (knex) {
    try {
        return knex.schema
            .createTableIfNotExists('coupons_user', (table) => {
                table.increments('id');
                table.string('email', 191).notNullable().unique();
                table.string('coupon_code', 10).notNullable().unique();
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
            .dropTableIfExists('coupons_user')
        )
        .finally(() => knex.raw("SET foreign_key_checks = 1;"));
};
