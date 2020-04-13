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

exports.findAllCas = function(page, pagesize, order, nameFilter, resumeFilter, zoneFilter, classificationFilter, callback) {
    let selectorEntry = '{';
    let selector = '';
    if(nameFilter){
        selector += '"cas_nom_dossier": {"$regex": ".*'+ nameFilter + '.*", "$options": "i"}';
        selector += ',';
    }
    if(resumeFilter){
        selector += '"cas_resume": {"$regex": ".*'+ resumeFilter + '.*", "$options": "i"}';
        selector += ',';
    }
    if(zoneFilter){
        selector += '"cas_zone_nom": {"$regex": ".*'+ zoneFilter + '.*", "$options": "i"}';
        selector += ',';
    }
    if(classificationFilter){
        let arrFilter = classificationFilter.split(',');
        if(arrFilter.indexOf('Autres') !== -1){
            const classificiations = [ "A", "B", "C", "D", "D1" ];
            
            let arrFormatted = classificiations.filter(value => arrFilter.indexOf(value) === -1 );
            selector += '"cas_classification": { "$nin": ' + JSON.stringify(arrFormatted) +' } }';
        }
        else{
            selector += '"cas_classification": { "$in": ' + JSON.stringify(arrFilter) + ' }';
            selector += ',';
        }
    }
    if(selector.length) {
        selector = selector.substring(0, selector.length - 1);
        selector = selectorEntry + selector + '}';
    }

    let selectorJson = selector ? JSON.parse(selector) : '';

    MongoClient.connect(url, function(err, client) {

		let db = client.db(dbName);

        if(!err) {
            // pas de tri sur la classification
            if(!order) {
                db.collection('cas_pub')
                    .find(selectorJson)
                    .skip(page * pagesize)
                    .limit(pagesize)
                    .toArray()
                    .then(arr => {
                        db.collection('cas_pub')
                            .find(selectorJson)
                            .count()
                            .then(rep => callback(arr, rep))
                    });
            }
            //tri effectué (avec sort)
            else {
                db.collection('cas_pub')
                    .find(selectorJson)
                    .sort({cas_classification: order})
                    .skip(page * pagesize)
                    .limit(pagesize)
                    .toArray()
                    .then(arr => {
                        db.collection('cas_pub')
                            .find(selectorJson)
                            .count()
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
            .then(function(data) {
            	let reponse;
                reponse = {
                    succes: false,
                    cas : null,
                    data : data,
                    msg: "erreur lors du find"
                };
                callback(reponse);
            });
        } else {
        	let reponse = {
                    	succes: false,
                        cas : null,
                        error : err,
                        msg: "erreur de connexion à la base"
                    };
            callback(reponse);
        }
    });
};

exports.findDataGrapheCasParAn = function(id, callback) {
    MongoClient.connect(url, function(err, client) {
		var db = client.db(dbName);
        if(!err) {
            db.collection("temoignages_pub")
                .aggregate(
                    [
                        {
                            $group : {
                                    _id : "$obs_AAAA",
                                    id_cas: { $push: "$id_cas" }
                            }
                        },
                        {
                            $sort : {
                                _id:1
                            }
                        }
                    ]
                )
                .toArray()
                .then(data => {
                    callback(data);
                })

        } else {
        	let reponse = {
                    	succes: false,
                        cas : null,
                        error : err,
                        msg: "erreur de connexion à la base"
                    };
            callback(reponse);
        }
    });
}
