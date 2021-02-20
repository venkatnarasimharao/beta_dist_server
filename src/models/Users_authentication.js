const { Model } = require('objection');

class Users_authentication extends Model {
    static get tableName() {
        return 'users_authentication';
    }
    static get idColumn() {
        return 'userid'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                userid: { type: 'integer' },
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                phonenumber: { type: 'string' },
                role: { type: 'string' },
                points: { type: 'integer' },
                status: { type: 'integer' },
                token: { type: ['string', 'null'] }, 
                profileUrl: { type: ['string', 'null'] },
                provider: { type: ['string', 'null'] },
                login_time: { type: ['datetime', 'null'] },
                logout_time: { type: ['datetime', 'null'] },
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Users_authentication