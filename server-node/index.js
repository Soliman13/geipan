const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const server = require('http').Server(app);
// pour les formulaires multiparts
var multer = require('multer');
var multerData = multer();

const mongoDBModule = require('./app_modules/crud-mongo');

// Pour les formulaires standards
const bodyParser = require('body-parser');
// pour les formulaires multiparts
var multer = require('multer');
var multerData = multer();

// Cette ligne indique le répertoire qui contient
// les fichiers statiques: html, css, js, images etc.
app.use(express.static(__dirname + '/public'));
// Paramètres standards du modyle bodyParser
// qui sert à récupérer des paramètres reçus
// par ex, par l'envoi d'un formulaire "standard"
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");

	next();
});

// Lance le serveur avec express
server.listen(port);
console.log("Serveur lancé sur le port : " + port);

// Test de la connexion à la base
app.get('/api/v1/connection', function (req, res) {
	// Pour le moment on simule, mais après on devra
	// réellement se connecte à la base de donnéesb
	// et renvoyer une valeur pour dire si tout est ok
	mongoDBModule.connexionMongo(function (err, db) {
		let reponse;

		if (err) {
			console.log("erreur connexion");
			reponse = {
				msg: "erreur de connexion err=" + err
			}
		} else {
			reponse = {
				msg: "connexion établie"
			}
		}
		res.send(JSON.stringify(reponse));

	});
});

app.get('/api/v1/cas', function (req, res) {
	// Si présent on prend la valeur du param, sinon 1
	let page = parseInt(req.query.page || 1);
	// idem si present on prend la valeur, sinon 10
	let pagesize = parseInt(req.query.pagesize || 10);

	let order = parseInt(req.query.order) || 0;
	let nameFilter = req.query.name || '';
	let resumeFilter = req.query.resume || '';
	let zoneFilter = req.query.zone || '';
	let classificationFilter = req.query.classification || '';

	mongoDBModule.findAllCas(page, pagesize, order, nameFilter, resumeFilter, zoneFilter, classificationFilter, function (data, count) {
		var objdData = {
			data: data,
			count: count
        };
        res.header("Content-Type", "application/json");
		res.send(JSON.stringify(objdData));
	});
});

// Récupération d'un seul cas par son id
app.get('/api/v1/cas/:id', function(req, res) {
	var id = req.params.id;

 	mongoDBModule.findCasById(id, function(data) {
 		res.send(JSON.stringify(data)); 
 	});
 
});

// Récupération de tous les temoignages
app.get('/api/v1/temoignages', function (req, res) {
	// Si présent on prend la valeur du param, sinon 1
	let page = parseInt(req.query.page || 1);
	// idem si present on prend la valeur, sinon 10
	let pagesize = parseInt(req.query.pagesize || 10);

	let name = req.query.name || '';

	mongoDBModule.findAllTemoignages(page, pagesize, name, function (data, count) {
		var objdData = {
			data: data,
			count: count
        };
        res.header("Content-Type", "application/json");
		res.send(JSON.stringify(objdData));
	});
});


// Récupération d'un seul temoignage par son id
app.get('/api/v1/temoignages/:id', function(req, res) {
	var id = req.params.id;

 	mongoDBModule.findTemoignageById(id, function(data) {
 		res.send(JSON.stringify(data)); 
 	});
 
});

//Récupération de tous les temoiganges d'un cas
app.get('/api/v1/cas/:id/temoignages', function(req, res) {
	var id = req.params.id;
 	mongoDBModule.findAllTemoignagesOfCas(id, function(data) {
 		res.send(data);
 	});
});