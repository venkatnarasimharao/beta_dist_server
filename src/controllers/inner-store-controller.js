const couponsModel = require("../models/Coupons");
const moment = require("moment");
const Users = require("../models/Users");
const CouponsUser = require("../models/Coupons_User");
const { raw } = require("objection");
const nodemailer = require("nodemailer");
const library = require("../libraries/userquery");
const { build } = require("joi");
const faq = require("../models/Faq");
const { async } = require("crypto-random-string");

// get coupons list
module.exports.getCouponsList = async (request, reply) => {
  console.log(request.body, "body for inner store");
  const getCopupon = couponsModel
    .query()
    .alias("c")
    .select(
      "c.*",
      "st.title as store_title",
      "st.slug as store_slug",
      "cat.title as category_title",
      "cat.slug as category_slug"
    )
    .leftJoinRelated(`[stores as st,categoreis as cat]`)
    .withGraphFetched("CouponUser(selectUser)")
    .modifiers({
      selectUser: (builder) => {
        builder.where("email", request.body.email);
      },
    })
    // .modifiers({
    //     onlyUserDetails: query => query.modify('onlyUserDetails', `${request.body.email}`)
    // })
    // .withGraphFetched(`CouponUser(defaultSelects)`)
    // .modifiers({
    //     defaultSelects: query => query.modify('onlyUserDetails', 'female')
    // })
    // .modifiers({
    //     onlyUserDetails: builder => {
    //         builder
    //             .select(`coupon_code`, `coupon_status`, `coupons_id`, `email`, `id`)
    //             .where('email', request.body.email);
    //     }
    // })
    // .modifiers('onlyUserDetails', request.body.email)
    .andWhere(`c.expiry`, `>=`, moment().format("YYYY-MM-DD"))
    .where(`c.store_id`, request.body.id);
  await getCopupon
    .then((result) => {
      return reply.status(200).json({
        success: true,
        statusCode: 200,
        message: "Successfully fetching data",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err, "error is here");
      return reply.status(500).json({
        success: false,
        statusCode: 500,
        message: "Unable to fetch data",
        data: null,
      });
    });
};

// post Coupons Code
module.exports.postCouponsCode = async (request, reply) => {
  try {
    let checkUserCouponsCount = null;
    await CouponsUser.query()
      .count(`id`)
      .where("email", request.body.userid)
      .andWhere("coupons_id", request.body.coupons_id)
      .then(([result]) => {
        checkUserCouponsCount = result ? result["count(`id`)"] : 0;
      });

    if (checkUserCouponsCount < 3) {
      let pointsVal = 0;
      await Users.query()
        .select("points")
        .where("email", request.body.userid)
        .then(([result]) => {
          result ? (pointsVal = result["points"]) : 0;
        });

      if (pointsVal) {
        await Users.query()
          .update({ points: pointsVal - 1 })
          .where("email", request.body.userid);
      }

      await CouponsUser.query().insert({
        email: request.body.userid,
        coupons_id: request.body.coupons_id,
        coupon_code: request.body.code,
        coupon_status: 0,
      });

      // send coupon to user email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: request.body.userid,
        subject: "Your Coupon Code",
        html: `<p>Hi ${request.body.username}, Your Coupon Code is ${request.body.code}</p>`,
      };

      await transporter.sendMail(mailOptions, async (err) => {
        if (err) {
          return reply.status(200).json({
            success: false,
            error: true,
            message: "Error while sent mail",
          });
        }
      });

      return reply.status(200).json({
        success: true,
        statusCode: 200,
        message: "Successfully Coupon Bought",
      });
    } else {
      return reply.status(200).json({
        success: false,
        statusCode: 200,
        message: "Coupon Limit Exceded",
      });
    }
  } catch (err) {
    console.log(err, "error in coupons");
    return reply.status(200).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong.. Please try again later....",
    });
  }
};

// check if coupon is valid or not
module.exports.checkCouponValidity = async (request, response) => {
  console.log("request body issss", request.body);

  await library
    .simpleselect(CouponsUser, "*", `coupon_code = '${request.body.coupon}'`)
    .then(async (result) => {
      console.log("Get response of coupons", result);

      if (!result || result.length == 0) {
        return response.status(200).json({
          success: false,
          error: true,
          message: "Invalid coupon or coupon is not generated",
          data: null,
        });
      } else if (result[0].coupon_status == 1) {
        return response.status(200).json({
          success: false,
          error: true,
          message: "Coupon is already validated",
          data: null,
        });
      }

      const updateCoupon = {
        id: result[0]["id"],
        coupon_status: 1,
      };

      await library
        .updateWithWhere(
          request,
          CouponsUser,
          updateCoupon,
          `id = ${result[0]["id"]}`
        )
        .then(async (resp) => {
          return response.status(200).json({
            success: true,
            error: false,
            message: "Coupon is valid",
            data: null,
          });
        })
        .catch((updateErr) => {
          console.log("Error while updating coupon status", updateErr);
          return response.status(200).json({
            success: false,
            error: true,
            message: "Failed to update a coupon status",
            data: null,
          });
        });
    })
    .catch((err) => {
      return response.status(200).json({
        success: false,
        error: true,
        message: "Failed to check coupon validity",
        data: null,
      });
    });
};

// check if server is working or not
module.exports.checkServerWorks = async (request, reply) => {
  console.log("check server hits");
  try {
    return response.status(200).json({
      success: true,
      error: false,
      message: "success to check",
    });
  } catch (err) {
    return response.status(200).json({
      success: false,
      error: true,
      message: "Failed to check",
    });
  }
};

module.exports.categoryInnerStore = async (request, reply) => {
  try {
    await couponsModel
      .query()
      .select("st.*")
      .innerJoinRelated(`stores as st`)
      .where(`category_id`, request.body.id)
      .limit(`${request.body.limit}`)
      .offset(`${request.body.offset}`)
      .then((data) => {
        return reply.status(200).json({
          success: true,
          error: false,
          data,
          message: "success to check",
        });
      });
  } catch (err) {
    return reply.status(200).json({
      success: false,
      error: true,
      message: "Failed to check",
    });
  }
};

module.exports.faqdata = async (request, reply) => {
  await faq
    .query()
    .select()
    .then((result) => {
      return reply.status(200).json({
        success: true,
        statusCode: 200,
        message: "Successfully fetching data",
        data: result,
      });
    })
    .catch((err) => {
      // console.log(err, 'error in fetch list')
      return reply.status(500).json({
        success: false,
        statusCode: 500,
        message: "Unable to fetch data",
        data: null,
      });
    });
};

module.exports.getLastFiveTransactions = async (request, reply) => {
  const LastFive = await CouponsUser
    .query()
    .alias("c")
    .select("c.updated_at", "CouponRelation:st.title")
    .leftJoinRelated(`CouponRelation.stores as st`)
    .where("c.email", request.body.email)
    .limit(5)
    .orderBy("updated_at", "desc");

  await CouponsUser
    .query()
    .alias("c")
    .select("c.updated_at", "CouponRelation:st.title")
    .leftJoinRelated(`CouponRelation.stores as st`)
    .where("c.email", request.body.email)
    .orderBy("updated_at", "desc")
    .then((result) => {
      return reply.status(200).json({
        success: true,
        statusCode: 200,
        message: "Successfully fetching data",
        data: result,
        LastFive: LastFive,
      });
    })
    .catch((err) => {
      // console.log(err, 'error in fetch list')
      return reply.status(500).json({
        success: false,
        statusCode: 500,
        message: "Unable to fetch data",
        data: null,
      });
    });
};


module.exports.getAdminCouponsCount = async (request,reply) => {
  const totalCount = await CouponsUser.query().count('*').as('totalCount')
  await CouponsUser.query().count('*')
  .as('redeemCount')
  .where('coupon_status', 1)
  .then(([result]) => {
    return reply.status(200).json({
      success: true,
      statusCode: 200,
      message: "Successfully fetching data",
      data: result ? result['count(*)'] : 0,
      totalCount: totalCount && totalCount.length ? totalCount[0]['count(*)'] : 0,
    });
  })
  .catch((err) => {
    // console.log(err, 'error in fetch list')
    return reply.status(500).json({
      success: false,
      statusCode: 500,
      message: "Unable to fetch data",
      data: null,
    });
  });
}