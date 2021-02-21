const { request } = require('chai');
const { response } = require('express');
const StoresModel = require('../models/Stores');
const Categories =require('../models/Categories')
const axios = require('axios');

module.exports.getCategoriesList = async (request, reply) => {
    await StoresModel.query()
        .select()
        .limit(`${request.body.limit}`)
        .offset(`${request.body.offset}`)
        .then(result => {
            return reply.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Successfully fetching data',
                data: result
            })
        }).catch(err => {
            // console.log(err, 'error in fetch list')
            return reply.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Unable to fetch data',
                data: null
            })
        })
}

//shop CategoriesList List
module.exports.CategoriesList = async (request, response) => {
    await Categories.query()
        .then(result => {
            return response.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Successfully fetching data',
                data: result
            })
        }).catch(err => {
            // console.log(err, 'error in fetch list')
            return response.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Unable to fetch data',
                data: null
            })
        })
}

module.exports.onlinestoredata = async (request, response) => {
    console.log('hitting onlinestoredata')
    const api_url = 'http://tools.vcommission.com/api/coupons.php?apikey=fe75ea1da8abe0780cffb2fa5744790b7b0dbc64312789e7521192ecb6e17c64'
    await axios.get(api_url)
        .then(result => {
        // console.log('result', result.data);
        return response.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Successfully fetching data',
            data: result.data
        })
    }).catch(err => {
        // console.log(err, 'error in fetch list')
        return response.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Unable to fetch data',
            data: null
        })
    })
}

//shop CategoriesList List
module.exports.shopCategoriesList = async (request, response) => {
    await StoresModel.query()
        .then(result => {
            return response.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Successfully fetching data',
                data: result
            })
        }).catch(err => {
            console.log(err, 'error in fetch list')
            return response.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Unable to fetch data',
                data: null
            })
        })
}