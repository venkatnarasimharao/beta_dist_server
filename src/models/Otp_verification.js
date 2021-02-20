const { Model } = require('objection');

class Otp_verification extends Model {
    static get tableName() {
        return 'otp_verification';
    }
    static get idColumn() {
        return 'otp_id '
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                otp_id : { type: ['integer', 'null'] },
                email: { type: ['string', 'null'] },
                otp_code: { type: ['string', 'null'] },
                status: { type: ['integer', 'number', 'null'] },
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Otp_verification;