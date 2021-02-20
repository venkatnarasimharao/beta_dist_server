const { Model } = require('objection');

class Auth_user extends Model {
    static get tableName() {
        return 'auth_user';
    }
    static get idColumn() {
        return 'auth_id'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                auth_id: { type: ['integer', 'null'] },
                username: { type: ['string', 'null'] },
                email: { type: ['string', 'null'] },
                password: { type: ['string', 'null'] },
                profileUrl: { type: ['string', 'null'] },
                provider: { type: ['string', 'null'] },
                token: { type: ['string', 'null'] },
                status: { type: ['integer', 'number', 'null'] },
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Auth_user;