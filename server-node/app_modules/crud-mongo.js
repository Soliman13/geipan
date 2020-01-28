var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'geipan';

exports.connexionMongo = function(callback) {
	MongoClient.connect(url, function(err, client) {
		var db = client.db(dbName);
		
		assert.equal(null, err);
		callback(err, db);
	});
}

exports.findAllCas = function(page, pagesize, name, callback) {
    MongoClient.connect(url, function(err, client) {

		var db = client.db(dbName);

        if(!err) {
			if(name == ''){
                db.collection('cas_pub')
                    .find()
                    .skip(page*pagesize)
                    .limit(pagesize)
                    .toArray()
                    .then(arr=>{
                        db.collection('cas_pub')
							.countDocuments()
							.then(rep=>callback(arr,rep))
					});
			}
			else{
					let query = {
						"name" : {$regex:".*"+name+".*",$options:"i"}
					}
                    db.collection('cas_pub')
                    .find(query)
                    .skip(page*pagesize)
                    .limit(pagesize)
                    .toArray()
                    .then(arr=>{
                        db.collection('cas_pub')
                            .find(query)
                            .countDocuments()
                            .then(rep=>callback(arr,rep))
                    });
			}
        }
        else {
            callback(-1);
        }
    });
};