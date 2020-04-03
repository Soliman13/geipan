# Projet Geipan


# Groupe : Achahbar Soliman, Boukadida Imen
# Master 2 MBDS

# Configuration

# Lancement de la base de données : 
- dans un terminal (CMD) :
- taper la commande : mongo 
- puis : taper "mongoimport --db=geipan --collection=cas_pub --type=csv --file=/example/cas_pub.csv --ignoreBlanks --headerLine" 
- puis : taper "mongoimport --db=geipan --collection=temoignages_pub --type=csv --file=/example/temoignages_pub.csv --ignoreBlanks --headerLine"
- dans le menu demarré de votre oridnateur: chercher la commande mongod puis lancer la.

# Lancement du Serveur : 
- ouvrir un autre terminal et aller à l'emplacement du dossier server-node de ce projet 
- lancer la commande "npm install"
- puis lancer la commande "node index.js"
- le serveur sera lancé dans "http:localhost:8080"
- tester l'API :  
    - http://localhost:8080/api/v1/cas
    - http://localhost:8080/api/v1/cas/5e309148d05f7366cbb69626
    - http://localhost:8080/api/v1/temoignages
    - http://localhost:8080/api/v1/temoignages/5e309148d05f7366cbb69626

# Lancement de la partie Client
- dans un autre terminal, aller dans le dossier srver-node 
- lancer la commande "npm install"
- puis lancer la commande "npm start"