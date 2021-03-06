const { Model } = require('objection')
class CouponsUser extends Model {
    static get tableName() {
        return 'coupons_user';
    }
    static get idColumn() {
        return 'id'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                email: { type: 'string' },
                coupons_id: { type: 'integer' },
                coupon_code: { type: 'string' },
                coupon_status: { type: 'tinyint' }, // 1 - not used, 0 - used
                created_at: { type: 'datetime' },
                updated_at: { type: 'datetime' }
            }
        }
    }
}

module.exports = CouponsUser