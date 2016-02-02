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
		var addMissionForm = '<form id="addMission" method="post" action="addMission"><h1>Add a Mission Statement</h1> <div class="divider"></div><textarea id="mission_statement" name="mission_statement" form="addMission" ></textarea><input type="submit" value="Submit"></form>';

		response.send(addMemberForm + addMissionForm);
	} else {  
		response.send("<h1>Sorry wrong password!</h1>");
	}
});


app.get('/getArticle', function (request, response){
	db.collection("articles", function (error1, coll) {
		if (!error1) {
			coll.find().sort({created_at:-1}).toArray(function (error2, results){
				if (results.length < 1) {
					response.send(404);
				} else {
					response.send(results[0]);
				}
			});
		} else {
			console.log(error1);
			response.send(500);
		}
	});
});


app.post('/addArticle', function (request, response) {
	var article_headline = request.body.article_headline;
	var article_text = request.body.article_text;
	var timestamp = new Date();
	var toInsert = {
		headline: article_headline,
		text: article_text,
		created_at: timestamp
	};

	db.collection('articles', function (error1, coll) {
		if (!error1) {
			coll.insert(toInsert, function (error2, success) {
				if (error2) {
					console.log(error2);
					response.send(500);
				} else {
					response.send("Success!");
				}
			});
		} else {
			console.log(error1); 
			response.send(500);
		}
	});
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

app.post('/addMission', function (request, response) {
	var mission_statement = request.body.mission_statement;
	console.log(mission_statement);
	var timestamp = new Date();
	
	if (mission_statement!= null && mission_statement != undefined) {
		var toInsert = {"text": mission_statement, "created_at":timestamp};
		db.collection('mission_statement', function (error1, coll) {
			if (!error1) {
				coll.insert(toInsert, function (error2, success) {
					if (error2) {
						console.log(error2);
						response.send(500);
					} else {
						response.send("Success!")
					}
				});
			} else {
				console.log(error);
				response.send(500);
			}
		}); 
	} else {
		response.send("Bad data");
	}
});

app.get('/getMission', function (request, response) {
	db.collection('mission_statement', function (error1, coll) {
		if (!error1) {
			coll.find().sort({created_at:-1}).toArray(function (error2, data) {
				if (!error2) {
					if (data.length <= 0) {
						response.send("This will apear under the about page");
					} else {
						response.send(data[0]['text']);
					}
				} else {
					console.log(error2);
					response.send("Whoops something went wrong");
				}
			});
		} else {
			console.log(error1);
			response.send("Whoops something went wrong")
		}
	});
});


app.post('/addMember', function (request, response) {
	/*response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");*/
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