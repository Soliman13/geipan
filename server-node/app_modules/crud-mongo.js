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
};

exports.findAllCas = function(page, pagesize, order, callback) {
    MongoClient.connect(url, function(err, client) {

		var db = client.db(dbName);

        if(!err) {
            // pas de tri sur la classification
            if(!order) {
                db.collection('cas_pub')
                    .find()
                    .skip(page * pagesize)
                    .limit(pagesize)
                    .toArray()
                    .then(arr => {
                        db.collection('cas_pub')
                            .countDocuments()
                            .then(rep => callback(arr, rep))
                    });
            }
            //tri effectué
            else {
                db.collection('cas_pub')
                    .find()
                    .sort({cas_classification: order})
                    .skip(page * pagesize)
                    .limit(pagesize)
                    .toArray()
                    .then(arr => {
                        db.collection('cas_pub')
                            .countDocuments()
                            .then(rep => callback(arr, rep))
                    });
			}
        }
        else {
            callback(-1);
        }
    });
};

exports.findCasById = function(id, callback) {
    MongoClient.connect(url, function(err, client) {
		var db = client.db(dbName);
        if(!err) {
        	// La requete mongoDB

            let myquery = { "_id": ObjectId(id)};

            db.collection("cas_pub") 
            .findOne(myquery, function(err, data) {
            	let reponse;
                console.log("response:", reponse);
                if(!err){
                    reponse = {
                    	succes: true,
                        cas : data,
                        error : null,
                        msg:"Details du cas envoyés"
                    };
                } else{
                    reponse = {
                    	succes: false,
                        cas : null,
                        error : err,
                        msg: "erreur lors du find"

                    };
                }
                callback(reponse);
            });
        } else {
        	let reponse = reponse = {
                    	succes: false,
                        cas : null,
                        error : err,
                        msg: "erreur de connexion à la base"
                    };
            callback(reponse);
        }
    });
};

exports.findAllTemoignages = function(page, pagesize, name, callback) {
    MongoClient.connect(url, function(err, client) {

		var db = client.db(dbName);

        if(!err) {
			if(name == ''){
                db.collection('temoignages_pub')
                    .find()
                    .skip(page*pagesize)
                    .limit(pagesize)
                    .toArray()
                    .then(arr=>{
                        db.collection('temoignages_pub')
							.countDocuments()
							.then(rep=>callback(arr,rep))
					});
			}
			else{
					let query = {
						"name" : {$regex:".*"+name+".*",$options:"i"}
					}
                    db.collection('temoignages_pub')
                    .find(query)
                    .skip(page*pagesize)
                    .limit(pagesize)
                    .toArray()
                    .then(arr=>{
                        db.collection('temoignages_pub')
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


exports.findTemoignageById = function(id, callback) {
    MongoClient.connect(url, function(err, client) {
		var db = client.db(dbName);
        if(!err) {
        	// La requete mongoDB

            let myquery = { "_id": ObjectId(id)};

            db.collection("temoignages_pub") 
            .findOne(myquery, function(err, data) {
            	let reponse;
                console.log("response:", reponse);
                if(!err){
                    reponse = {
                    	succes: true,
                        cas : data,
                        error : null,
                        msg:"Details du temoigange envoyés"
                    };
                } else{
                    reponse = {
                    	succes: false,
                        cas : null,
                        error : err,
                        msg: "erreur lors du find"

                    };
                }
                callback(reponse);
            });
        } else {
        	let reponse = reponse = {
                    	succes: false,
                        cas : null,
                        error : err,
                        msg: "erreur de connexion à la base"
                    };
            callback(reponse);
        }
    });
}
exports.findAllTemoignagesOfCas = function(id, callback) {
    MongoClient.connect(url, function(err, client) {
		var db = client.db(dbName);
        if(!err) {
        	// La requete mongoDB

            let myquery = { "id_cas": parseInt(id)};

            db.collection("temoignages_pub") 
            .find(myquery)
            .toArray()
            .then(function(err, data) {
            	let reponse;
                console.log("response:", reponse);
                if(!err){
                    reponse = {
                    	succes: true,
                        cas : data,
                        error : null,
                        msg:"Details de tous les temoiganges d'un cas envoyés"
                    };
                } else{
                    reponse = {
                    	succes: false,
                        cas : null,
                        error : err,
                        msg: "erreur lors du find"
                    };
                }
                callback(reponse);
            });
        } else {
        	let reponse = reponse = {
                    	succes: false,
                        cas : null,
                        error : err,
                        msg: "erreur de connexion à la base"
                    };
            callback(reponse);
        }
    });
}
