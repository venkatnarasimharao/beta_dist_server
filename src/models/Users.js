const { Model } = require('objection');

class Users extends Model {
    static get tableName() {
        return 'users';
    }
    static get idColumn() {
        return 'id'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: ['string', 'null'] },
                facebook_id : { type: ['string', 'null'] },
                google_id : { type: ['string', 'null'] },
                mobile: { type: ['string', 'null'] },
                gender: { type: ['string', 'null'] },
                dob: { type: ['string', 'null'] },
                address: { type: ['string', 'null'] },
                website: { type: ['string', 'null'] },
                brief: { type: ['string', 'text', 'null'] },
                image: { type: ['string', 'null'] },
                is_admin: { type: ['integer', 'number', 'null'] },
                is_active: { type: ['integer', 'number', 'null'] },
                confirmed: { type: ['integer', 'number', 'null'] },
                confirmation_code: { type: ['string', 'null'] },
                remember_token: { type: ['string', 'null'] },
                role: { type: ['string', 'null'] },
                points: { type: ['integer', 'number', 'null'] },
                status: { type: ['integer', 'number', 'null'] },
                provider: { type: ['string', 'null'] },
                login_time: { type: ['datetime', 'null'] },
                logout_time: { type: ['datetime', 'null'] },
                created_at: { type: 'timestamp' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Users