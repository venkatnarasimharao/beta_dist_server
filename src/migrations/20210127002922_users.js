exports.up = function (knex) {
    try {
        return knex.schema
            .createTableIfNotExists('users', (table) => {
                table.increments('id');
                table.string('name', 191).notNullable();
                table.string('email', 191).notNullable().unique();
                table.string('password', 191).defaultTo(null);
                table.string('facebook_id', 191).defaultTo(null).unique();
                table.string('google_id', 191).defaultTo(null).unique();
                table.string('mobile', 191).defaultTo(null);
                table.string('gender', 191).defaultTo(null);
                table.string('dob', 191).defaultTo(null);
                table.string('address', 191).defaultTo(null);
                table.string('website', 191).defaultTo(null);
                table.specificType('brief', "text").defaultTo(null);
                table.string('image', 255).defaultTo(null);
                table.specificType('is_admin', "tinyint").defaultTo(0);
                table.specificType('is_active', "tinyint").defaultTo(0);
                table.specificType('confirmed', "tinyint").defaultTo(1);
                table.string('confirmation_code', 255).defaultTo(null);
                table.string('remember_token', 255).defaultTo(null);
                table.string('role', 50).notNullable().defaultTo('user');
                table.integer('points', 100).notNullable().defaultTo(200);
                table.integer('status').notNullable().defaultTo(0);
                table.string('provider', 50).notNullable().defaultTo(null);
                table.timestamp('login_time').defaultTo(knex.fn.now());
                table.timestamp('logout_time').defaultTo(knex.fn.now());
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
            .dropTableIfExists('users')
        )
        .finally(() => knex.raw("SET foreign_key_checks = 1;"));
};
