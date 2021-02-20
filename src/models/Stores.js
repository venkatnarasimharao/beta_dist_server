const { Model } = require('objection')

class User extends Model {
    static get tableName() {
        return 'stores';
    }
    static get idColumn() {
        return 'id'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                slug: { type: 'string' },
                title: { type: 'string' },
                image: { type: 'string' },
                link: { type: 'string' },
                is_featured: { type: 'integer' },
                is_active: { type: 'integer' },
                created_at: { type: 'date' },
                updated_at: { type: 'date' }
            }
        }
    }
}

module.exports = User