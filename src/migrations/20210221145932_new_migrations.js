exports.up = function (knex) {
    try {
        return knex.schema
            .raw(`INSERT INTO stores (id, slug, title, image, link, is_featured, is_active, created_at, updated_at) VALUES ('0', 'devi family resturent new', 'DEVI FAMILY RESTUARENT', '1595177722thumbB6.gif', 'http://devifamilyrestuarent.com/', '1', '1', '2020-07-19 11:25:22', '2020-07-19 11:25:22'), ('0', 'flipkart new', 'Flipkart', '1595156453thumbB8.png', 'https://www.flipkart.com/', '1', '1', '2020-07-12 02:02:57', '2020-07-19 05:30:53')`)
    } catch (err) {
        console.log(err, 'error in migrations')
        exports.down();
    }
};

exports.down = function (knex) {
    return knex
        .raw("SET foreign_key_checks = 0;")
        .then(() => knex.schema
            .raw(`TRUNCATE TABLE stores`)
        )
        .finally(() => knex.raw("SET foreign_key_checks = 1;"));
};
