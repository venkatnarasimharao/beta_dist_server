const couponsModel = require('../models/Coupons');
const { insertOrUpdate } = require('../libraries/userquery')
const moment = require('moment');
const Users = require('../models/Users');
const CouponsUser = require('../models/Coupons_User');
const { raw } = require('objection');
const nodemailer = require('nodemailer');


module.exports.getCouponsList = async (request, reply) => {
    const getCopupon = couponsModel.query()
        .alias('c')
        .select(
            'c.*',
            'st.title as store_title',
            'st.slug as store_slug',
            'cat.title as category_title',
            'cat.slug as category_slug'
        )
        .leftJoinRelated(`[stores as st,categoreis as cat]`)
        .withGraphFetched(`CouponUser`)
        .modifiers({
            onlyUserDetails: builder => {
                builder
                    .select(`coupon_code`, `coupon_status`, `coupons_id`, `email`, `id`)
                    .where('email', request.body.email);
            }
        })
        .andWhere(`c.expiry`, `>=`, moment().format('YYYY-MM-DD'))
        .where(`c.store_id`, request.body.id)
    await getCopupon.then(result => {
        return reply.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Successfully fetching data',
            data: result
        })
    }).catch(err => {
        console.log(err, 'error is here')
        return reply.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Unable to fetch data',
            data: null
        })
    })
}

// postCouponsCode
module.exports.postCouponsCode = async (request, reply) => {
    try {
        let checkUserCouponsCount = null;
        await CouponsUser.query()
            .count(`id`)
            .where('email', request.body.userid)
            .andWhere('coupons_id', request.body.coupons_id)
            .then(([result]) => {
                checkUserCouponsCount = result ? result['count(`id`)'] : 0
            })

        if (checkUserCouponsCount < 3) {
            await Users.query()
                .update({ points: request.body.points })
                .where('email', request.body.userid)

            await CouponsUser.query().insert({
                email: request.body.userid,
                coupons_id: request.body.coupons_id,
                coupon_code: request.body.code
            })

            // mail 
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                secure: false,
                auth: {
                    user: 'maheshpm1599@gmail.com',
                    pass: 'MaheshCse@9843'
                }
            });

            const mailOptions = {
                from: 'todosharebuzz4us@gmail.com',
                to: request.body.userid,
                subject: 'Your Coupon Code Of Bacata Store',
                html: `<p>Hi ${request.body.username}, Your Coupon Code is ${request.body.code}</p>`
            }

            await transporter.sendMail(mailOptions, async (err) => {
                if (err) {
                    return reply.status(200).json({
                        success: false,
                        error: true,
                        message: 'Error while sent mail',
                    });
                }
            })

            return reply.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Successfully Coupon Bought',
                points: request.body.points
            })
        } else {
            return reply.status(200).json({
                success: false,
                statusCode: 200,
                message: 'Coupon Limit Exceded'
            })
        }
    } catch (err) {
        return reply.status(200).json({
            success: false,
            statusCode: 500,
            message: 'Something went wrong.. Please try again later....',
        })
    }
}