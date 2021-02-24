exports.up = function (knex) {
    try {
        return knex.schema
            .alterTable('coupons_user', (table) => {
                table.integer('coupons_id').defaultTo(null).after('email');
                table.tinyint('coupon_status', 1).defaultTo(1).after('coupon_code');
            })
            .raw(`ALTER TABLE users CHANGE name name VARCHAR(191) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE email email VARCHAR(191) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE provider provider VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;`)
    } catch (err) {
        console.log(err, 'error in migrations')
        exports.down();
    }
};

exports.down = function (knex) {
    return knex
        .raw("SET foreign_key_checks = 0;")
        .then(() => knex.schema
            .raw(`TRUNCATE TABLE users`)
        )
        .finally(() => knex.raw("SET foreign_key_checks = 1;"));
};