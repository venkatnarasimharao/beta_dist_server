exports.up = function (knex) {
  try {
    return knex.schema
    .alterTable("coupons_user", (table) => {
        table.dropUnique('email', ['coupons_user_email_unique']);
        table.dropUnique('coupon_code', ['coupons_user_coupon_code_unique']);
        table.unique(['coupon_code', 'email'], 'coupons_user_email_coupons_uniq')
    });
  } catch (err) {
    console.log(err, "error in migrations");
    exports.down();
  }
};

exports.down = function (knex) {
  return knex
    .raw("SET foreign_key_checks = 0;")
    .then(() => knex.schema.raw(`TRUNCATE TABLE coupons_user`))
    .finally(() => knex.raw("SET foreign_key_checks = 1;"));
};
