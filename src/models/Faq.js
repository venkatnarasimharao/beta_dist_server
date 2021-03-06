const { Model } = require('objection')
class Faq extends Model {
    static get tableName() {
        return ' faqs';
    }
    static get idColumn() {
        return 'id'
    }
    static get jsonSchema() {
        return { 
            type: 'object',
            properties: {
                id: { type: 'integer' },
                faq_category_id: { type: 'integer' },
                question: { type: 'string' },
                answer: { type: 'string' },
                like: { type: 'integer' },
                dislike: { type: 'integer' },
                created_at: { type: 'date' },
                updated_at: { type: 'date' }
            }
        }
    }
}
module.exports = Faq