exports.up = function (knex) {
    try {
        return knex.schema
            .createTableIfNotExists('categories', (table) => {
                table.increments('id');
                table.string('slug', 191).defaultTo(null).unique();
                table.string('title', 191).defaultTo(null);
                table.string('icon', 191).defaultTo(null);
                table.string('image', 191).defaultTo(null);
                table.tinyint('is_active', 50).defaultTo(1);
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
            .dropTableIfExists('categories')
        )
        .finally(() => knex.raw("SET foreign_key_checks = 1;"));
};
