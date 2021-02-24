exports.up = function (knex) {
  try {
    return knex.schema.createTableIfNotExists("coupons_user", (table) => {
      table.increments("id");
      table.string("email", 191).notNullable();
      table.string("coupon_code", 10).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.unique(["coupon_code", "email"], "coupons_user_email_coupons_uniq");
    });
  } catch (err) {
    console.log(err, "error in migrations");
    exports.down();
  }
};

exports.down = function (knex) {
  return knex
    .raw("SET foreign_key_checks = 0;")
    .then(() => knex.schema.dropTableIfExists("coupons_user"))
    .finally(() => knex.raw("SET foreign_key_checks = 1;"));
};
