const { Model } = require('objection')
class Categories extends Model {
    static get tableName() {
        return 'categories';
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
                icon: { type: 'string' },
                image: { type: 'string' },
                is_active: { type: 'tinyint' },
                created_at: { type: 'date' },
                updated_at: { type: 'date' }
            }
        }
    }
}

module.exports = Categories