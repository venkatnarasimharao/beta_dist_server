const _ = require('underscore');
const Joi = require('joi');
const library = require('../libraries/userquery');
const jwt = require('jsonwebtoken');
const https = require('https');
const fetch = require('node-fetch');


// GET all strores data
module.exports.getAllStores = (req, res, next) => {

    let url = `https://vcm.api.hasoffers.com/Apiv3/json?api_key=bbb166abe324002099344cb3da228ac8528563a1c7d067af8c20ef6b2d9afbba&Target=Affiliate_Offer&Method=findAll&fields[]=status&fields[]=id&fields[]=name&fields[]=currency&filters[currency][NULL]=&sort[name]=asc&limit=25&contain[]=OfferCategory`;

    // let settings = { method: "Get" };

    // fetch(url, settings)
    //     .then(res => res.json())
    //     .then((json) => {
    //         console.log(json)
    //         // do something with JSON
    //     });

    https.get(url, (res) => {
        let body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end", () => {
            try {
                let json = JSON.parse(body);

                let data = Object.values(json['response']['data']['data']);

                console.log(data, "Original Data");

                let filterData = _.groupBy(Object.values(json['response']['data']['data']), 'category');

                let categories = Object.values(filterData['undefined']);

                console.log(categories, "filtered categories");

                response.status(200).json({categories: categories});
            } catch (error) {
                console.error(error.message);
            };
        });

    }).on("error", (error) => {
        console.error(error.message);
    });
}