exports.up = function (knex) {
    try {
        return knex.schema
            .raw(`ALTER TABLE coupons_user ADD if not exists coupons_id INT NULL DEFAULT NULL AFTER email;`)
            .raw(`ALTER TABLE coupons_user ADD if not exists coupon_status TINYINT(1) NOT NULL DEFAULT '1' AFTER coupon_code;`)
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