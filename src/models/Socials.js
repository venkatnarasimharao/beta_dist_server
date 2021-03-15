const { Model } = require('objection')

class Socials extends Model {
    static get tableName() {
        return 'socials';
    }
    static get idColumn() {
        return 'id'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: ['integer', null] },
                title: { type: ['string', null] },
                icon: { type: ['string', null] },
                url: { type: ['string', null] },
                created_at: { type: 'timestamp' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Socials;