/*global global,require,console*/
var sqlite = require('sqlite3').verbose(),
    db = new sqlite.Database('./fulldata.db'),
    mongo = require('mongodb'),
    test = require('assert'),
    colors = require('colors');

var mongoUrl = 'mongodb://127.0.0.1:27017/test', sum = 0, num = 0;

mongo.MongoClient.connect(mongoUrl, function (err, mongo) {
    'use strict';
    test.equal(null, err);
    
    var allTableSql = 'select * from sqlite_master';
    db.all(allTableSql, function (err1, data) {  // 查询所有表名
        test.equal(null, err1);
        
        data.forEach(function (value, index, arr) {
            
            if (value.type === 'table') {
                var sql = 'select * from ' + value.tbl_name;
                
                db.all(sql, function (err2, data1) {
                    test.equal(null, err2);
                    
                    if (data1.length > 0) {
                        sum += 1;
                        mongo.collection(value.tbl_name, function (err3, mongodb) {
                            test.equal(null, err3);

                            mongodb.insert(data1, function (err4, result) {
                                test.equal(null, err4);
                                var colorTable = '< ' + value.tbl_name + ' >';
                                console.log('Congratulation! ' + colorTable.magenta + ' copy to mongodb' + ' success'.green + '.');
                                num += 1;
                                if (num >= sum) {
                                    db.close();
                                    mongo.close();
                                    console.log('\n all of the database are copied success from sqlite3 to mongodb. \n mongodb & sqlite3 was closed.');
                                }
                            });
                        });
                    }
                });
            }
        });
    });
});