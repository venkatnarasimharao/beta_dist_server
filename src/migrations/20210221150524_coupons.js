exports.up = function (knex) {
    try {
        return knex.schema
            .createTableIfNotExists('coupons', (table) => {
                table.increments('id');
                table.integer('user_id', 11).notNullable().unsigned();
                table.integer('store_id', 11).unsigned();
                table.integer('category_id', 10).notNullable().unsigned();
                table.string('type', 255).defaultTo(null);
                table.integer('forum_category_id', 10).notNullable().unsigned();
                table.string('uni_id', 191).defaultTo(null);
                table.string('slug', 191).defaultTo(null);
                table.string('title', 191).defaultTo(null);
                table.string('code', 191).defaultTo(null);
                table.integer('price').defaultTo(null);
                table.integer('discount').defaultTo(null);
                table.string('link').defaultTo(null);
                table.date('expiry').defaultTo(null);
                table.integer('rating').defaultTo(0);
                table.text('detail').defaultTo(null);
                table.string('image', 191).defaultTo(null);
                table.integer('user_count', 11).defaultTo(0);
                table.tinyint('is_featured', 1).defaultTo(0);
                table.tinyint('is_exclusive', 1).defaultTo(1);
                table.tinyint('is_front', 1).defaultTo(1);
                table.tinyint('is_active', 1).defaultTo(1);
                table.tinyint('is_verified', 1).defaultTo(0);
                table.timestamp('created_at').defaultTo(knex.fn.now());
                table.timestamp('updated_at').defaultTo(knex.fn.now());
                table
                    .foreign('store_id', 'store_id_fk')
                    .references('stores.id')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE')
                    .withKeyName('store_id_fk');
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
            .dropTableIfExists('coupons')
        )
        .finally(() => knex.raw("SET foreign_key_checks = 1;"));
};
