const { Model } = require('objection')

class Sliders extends Model {
    static get tableName() {
        return 'sliders';
    }
    static get idColumn() {
        return 'id'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: ['integer', null] },
                is_image: { type: ['integer', 'number', null] },
                title: { type: ['string', null] },
                heading: { type: ['string', null] },
                subheading: { type: ['string', null] },
                link: { type: ['string', null] },
                image: { type: ['string', null] },
                is_overlay: { type: ['integer', 'number', null] },
                is_parallax: { type: ['integer', 'number', null] },
                is_active: { type: ['integer', 'number', null] },
                created_at: { type: 'timestamp' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Sliders;