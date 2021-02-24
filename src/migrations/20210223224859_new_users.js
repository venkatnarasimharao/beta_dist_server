exports.up = function (knex) {
    try {
        return knex.schema
            .raw(`ALTER TABLE users CHANGE password password TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE image image TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE remember_token remember_token TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL`)
            .raw(`ALTER TABLE users CHANGE name name VARCHAR(191) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE email email VARCHAR(191) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE provider provider VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL`)
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

// ALTER TABLE `users` CHANGE `password` `password` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE `image` `image` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE `remember_token` `remember_token` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
// ALTER TABLE `users` CHANGE `name` `name` VARCHAR(191) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE `email` `email` VARCHAR(191) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE `provider` `provider` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;