const { Model } = require("objection");

class Coupons extends Model {
  static get tableName() {
    return "coupons";
  }
  static get idColumn() {
    return "id";
  }
  static get relationMappings() {
    const StoreModel = require("./Stores");
    const categoriesModel = require("./Categories");
    const CouponUser = require("./Coupons_User");
    return {
      stores: {
        relation: Model.HasOneRelation,
        modelClass: StoreModel,
        join: {
          from: "coupons.store_id",
          to: "stores.id",
        },
      },
      categoreis: {
        relation: Model.HasOneRelation,
        modelClass: categoriesModel,
        join: {
          from: "coupons.category_id",
          to: "categories.id",
        },
      },
      CouponUser: {
        relation: Model.HasManyRelation,
        modelClass: CouponUser,
        join: {
          from: "coupons.id",
          to: "coupons_user.coupons_id",
        },
      },
    };
  }

  // static get modifiers() {
  //     return {
  //       // Note that this modifier takes an argument.
  //       onlyUserDetails(builder, userEmail) {
  //         builder.where('email', userEmail);
  //       }
  //     };
  //   }

  // static modifiers = {
  //   // Note that this modifier takes an argument.
  //   onlyUserDetails(query, userEmail) {
  //       query.where("email", userEmail);
  //   }
  // };

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: ["integer", "null"] },
        user_id: { type: ["integer", "null"] },
        store_id: { type: ["integer", "null"] },
        category_id: { type: ["integer", "null"] },
        type: { type: ["string", "null"] },
        forum_category_id: { type: ["integer", "null"] },
        uni_id: { type: ["string", "null"] },
        slug: { type: ["string", "null"] },
        title: { type: ["string", "null"] },
        code: { type: ["string", "null"] },
        price: { type: ["integer", "null"] },
        discount: { type: ["integer", "null"] },
        link: { type: ["string", "null"] },
        expiry: { type: ["string", "null"] },
        rating: { type: ["integer", "null"] },
        detail: { type: ["string", "null"] },
        image: { type: ["string", "null"] },
        user_count: { type: ["integer", "null"] },
        is_featured: { type: ["integer", "null"] },
        is_exclusive: { type: ["integer", "null"] },
        is_front: { type: ["integer", "null"] },
        is_active: { type: ["integer", "null"] },
        is_verified: { type: ["integer", "null"] },
        created_at: { type: "datetime" },
        updated_at: { type: "datetime" },
      },
    };
  }
}

module.exports = Coupons;
