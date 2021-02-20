require('dotenv').config();
var Knexx = require('../config/knex');
const CryptoJS = require('crypto-js');

const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, process.env.SECURITY_KEY).toString();
}

const decrypt = (text) => {
    return CryptoJS.AES.decrypt(text, process.env.SECURITY_KEY).toString(CryptoJS.enc.Utf8);
}

const simpleselect = (Model, column, where) => {
    return new Promise((resolve, reject) => {
        let query = Knexx.knex.select(column).from(Model.tableName);
        if (where) {
            query = query.whereRaw(where);
        }
        console.log("Final simpleselect query isss ===>", query.toQuery());
        query.then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        })
    })
}

const commonSelectQuery = (request, Model, ModelAlias, allData) => {
    let query
    return new Promise((resolve, reject) => {
        try {
            // 1 model
            query = Model.query(request.knex)
            // 2 alias
            if (ModelAlias) query = query.alias(ModelAlias)
            // 3 select list
            query = query.select(raw(allData.selectList))
            // 4 joins
            if (allData.joins) {
                for (const row of allData.joins) {
                    switch (row.type) {
                        case 'left':
                            query = query.leftJoin(
                                `${row.tableName} as ${row.alias}`,
                                raw(row.onConditions)
                            )
                            break
                        case 'right':
                            query = query.rightJoin(
                                `${row.tableName} as ${row.alias}`,
                                raw(row.onConditions)
                            )
                            break
                        case 'inner':
                            query = query.innerJoin(
                                `${row.tableName} as ${row.alias}`,
                                raw(row.onConditions)
                            )
                            break
                        case 'full':
                            query = query.fullOuterJoin(
                                `${row.tableName} as ${row.alias}`,
                                raw(row.onConditions)
                            )
                            break
                        case 'relation':
                            query = query.joinRelation(`${row.tableName} as ${row.alias}`)
                            break
                        case 'inner-relation':
                            query = query.innerJoinRelation(`${row.tableName}`)
                            break
                        case 'left-relation':
                            query = query.leftJoinRelation(`${row.tableName}`)
                            break
                        case 'right-relation':
                            query = query.rightJoinRelation(`${row.tableName}`)
                            break
                        default:
                            break
                    }
                }
            }
            // 5 where
            if (allData.where) query = query.whereRaw(allData.where)
            // 6 having
            if (allData.having) query = query.havingRaw(allData.having)
            // 7 group by
            if (allData.groupBy) query = query.groupByRaw(allData.groupBy)
            if (allData.groupby) query = query.groupByRaw(allData.groupby)
            // 8 order by
            if (allData.orderBy) query = query.orderByRaw(allData.orderBy)
            if (allData.orderby) query = query.orderByRaw(allData.orderby)
            // 9 limit
            if (allData.limit) query = query.limit(allData.limit)
            if (allData.skip) query = query.offset(allData.skip)

            console.log("Final simpleselect query isss ===>", query.toQuery());
            resolve(query)
        } catch (error) {
            console.log(error, '$$error in common function')
            reject(error)
        }
    })
}

// insert the data query build method
const insertData = (request, Model, data) => {
    return new Promise((resolve, reject) => {
        let query = Knexx.knex(Model.tableName).insert(data);
        console.log("Final insertData query isss ===>", query.toQuery());
        query.then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    })
}

// insert or update data query bulid method
const insertOrUpdate = (request, Model, data) => {
    return new Promise((resolve, reject) => {
        let insertData = data && data.hasOwnProperty('length') ? data : [data];
        let keys = Object.keys(insertData[0]);
        let query = Knexx.knex(Model.tableName).insert(insertData).onConflict('email').merge();
        console.log("Final insertOrUpdate query isss ===>", query.toQuery());
        query.then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        })
    })
}

// update data with where condition query bulid method
const updateWithWhere = (request, Model, data, condition) => {
    return new Promise(async(resolve, reject) => {
        let query = Knexx.knex(Model.tableName).whereRaw(condition).update(data);
        console.log("Final updateWithWhere query isss ===>", query.toQuery());
        query.then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        })
    })
}

module.exports = {
    encrypt,
    decrypt,
    simpleselect,
    commonSelectQuery,
    insertData,
    insertOrUpdate,
    updateWithWhere,
}