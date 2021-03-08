const { Model } = require('objection');

class User_bank_details extends Model {
    static get tableName() {
        return 'user_bank_details';
    }
    static get idColumn() {
        return 'bank_id  '
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                bank_id  : { type: ['integer', 'number', 'null'] },
                bank_name: { type: ['string', 'null'] },
                bank_holder: { type: ['string', 'null'] },
                branch_name: { type: ['string', 'null'] },
                account_no: { type: ['string', 'null'] },
                ifsc_code: { type: ['string', 'null'] },
                pan_card: { type: ['string', 'null'] },
                user_id: { type: ['integer', 'number', 'null'] },
                status: { type: ['integer', 'number', 'null'] },
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = User_bank_details;