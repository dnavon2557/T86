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
app.post('/getForms', function (request, response) {
	console.log(request.body.pass);
	if (request.body.pass == "cookingupastorm") {
		var addMemberForm = '<form id="addMembers" method="post" action="/addMember"><h1>Add Members</h1><div class="divider"></div><h3>Enter the URL for an image</h3><input type="text" name="member_image_url"><h3>Enter the name of the new member</h3><input type="text" name="member_name"><h3>Enter a short bio for the new member</h3>	<textarea id="member_bio" name="member_bio" form="addMembers"></textarea><input type="submit" value="Submit"></form>';
		var addMissionForm = '<form id="addMission" method="post" action="addMission"><h1>Add a Mission Statement</h1> <div class="divider"></div><textarea name="mission_statement" form="addMission"></textarea><input type="submit" value="Submit"></form>';

		response.send(addMemberForm + addMissionForm);
	} else {
		response.send("<h1>Sorry wrong password!</h1>");
	}
});

app.get('/members', function (request, response) {
	var html = "";
	db.collection('members', function (error, coll) {
		if (!error) {
			coll.find().sort({"name":1}).toArray( function (error, results) {
				if (!error) {
					//console.log(results);
					for (var i = 0; i < results.length; i++) {
						html +=	"<div class='member'>\n<img class = 'bubble' src=" +results[i]['image_url']+ ">\n<h2 class='bubble-header'>" +results[i]['name']+ "</h2>\n</div>";
					}
					response.send(html);
				} else {
					console.log(error);
					response.send(500);
				}
			});
		} else {
			console.log(error);
			response.send(404);
		}
	});
});

app.post('/addMember', function (request, response) {
	response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var image_url = request.body.member_image_url;
    var name = request.body.member_name;
    var bio = request.body.member_bio;
    console.log(image_url,name,bio);
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
	    				response.send('Success!');
	    			}

	    		});
	    	} else {
	    		console.log(error);
	    	}

	    });
	} else {
		response.send("Bad Data");
	}
});



app.listen(process.env.PORT || 5000); 