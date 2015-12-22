var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var validator = require('validator'); 

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/inTune';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// landing page
app.get('/', function (request, response) {
  response.sendFile(__dirname + "/index.html");
});
app.post('/addMember', function (request, response) {
	response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var image_url = request.body.member_image_url;
    var name = request.body.member_name;
    var bio = request.body.member_bio;
    if (image_url != null && image_url != undefined && name != null && name !=undefined && bio!=null && bio != undefined) {
	    var toInsert = {
	    	"image_url": image_url,
	    	"name": name,
	    	"bio": bio
	    }
	    db.collection('members', function (error, coll) {
	    	if (!error) {
	    		coll.insert(toInsert, function (error, success) {
	    			if (error) {
	    				console.log(error);
	    			} else {
	    				response.status(200).send('Success!');
	    			}

	    		});
	    	}

	    });
	    response.send(200);
	}
});



app.listen(process.env.PORT || 5000); 