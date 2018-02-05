// Import modules
var express = require('express'),
	request = require('request'),
	bodyParser = require('body-parser'),
	http = require('http'),
	firebase = require('firebase'),
	admin = require("firebase-admin"),
	schedule = require('node-schedule'),
	Slack = require('slack-node');

var config = {
	apiKey: "AIzaSyBr9HEtbWPCQjIRltwVQ9ea4KPolliOjfA",
	authDomain: "groot-database.firebaseapp.com",
	databaseURL: "https://groot-database.firebaseio.com",
	projectId: "groot-database",
	storageBucket: "groot-database.appspot.com",
	messagingSenderId: "152868225010"
};

//start express app
var app = express();

// parse application/json
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false}))

firebase.initializeApp(config);

var PORT=8080;
var clientId = '55182832290.302872954259';
var clientSecret = '8640aafad56fb739b3d1d02c50dbda44';

var valueCounter = null,
	dayCounter = null;

//chrono job variable globals
var rule = new schedule.RecurrenceRule();
rule.minute = 30;
rule.hour = 9;
// rule.dayOfWeek = [0-7];

webhookUri = "https://hooks.slack.com/services/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";
 
slack = new Slack();
slack.setWebhook(webhookUri);
 
slack.webhook({
	'channel': "#groot",
	'username': "webhookbot",
    "text": "Groot Bot Poll",
    "attachments": [
        {
            "title": "Groot Statistics",
            "fields": [
                {
                    "title": "Soil Composition",
                    "value": "1",
                    "short": true
                },
                {
                    "title": "Last Watered",
                    "value": "Tuesday January 22th at 10:00am",
            		"short": false
                }
            ]
        },
        {
            "fallback": "Should Groot be watered?",
            "title": "Should Groot be watered?",
            "callback_id": "groot_response",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "water_groot",
                    "text": "Yes!",
                    "type": "button",
                    "value": "true"
                },
                {
                    "name": "do_not_water_groot",
                    "text": "No!",
                    "type": "button",
                    "value": "false"
                }
            ]
        }
    ]
}, function(err, response) {

});

function unixToString(unixTime){
	return new Date(unixTime*1000).toString();
}

app.post('/groot', function(req, res) {
	var body = req.body,
		json = JSON.parse(body.payload),
		userValue = json.actions[0].value,
		apiTimeStamp = json.action_ts,
		timeStamp = unixToString(apiTimeStamp);


	console.log("dayCounter",dayCounter);
	console.log("timeStamp", timeStamp);
	console.log("value ", json.actions[0].value);


	var ref = firebase.database().ref('poll/day1');

	var data = {
		'value': userValue
	}

	ref.set(data, function(error){
		if(error){
			console.log('Data could not be saved');
		}else{
			console.log('Data saved successfully');
		}
	})

	res.send()
}); 
var chronoJob = schedule.scheduleJob(rule, function(){
	dayCounter++
	// var currentDate = Date.now();
	// console.log("currentDate", currentDate);

	var currentDate = Math.round(+new Date()/1000);
	currentDate = unixToString(currentDate)
	console.log("currentDate", currentDate);

	var setRef = firebase.database().ref("poll/"+dayCounter);

	var dateObject = {
		'dateStamp': currentDate
	}

	setRef.set(dateObject, function(error){
		if(error){
			console.log('Data could not be saved');
		}else{
			console.log('Data saved successfully');
		}
	});

	console.log('Groot Poll Firing');
});

// ngrok tunnel
app.listen(PORT, function () {
    //Callback triggered when server is successfully!
    console.log("Example app listening on port " + PORT);
});

app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});
app.get('/', function(req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

// Route the endpoint that our slash command will point to and send back a simple response to indicate that ngrok is working
// app.post('/command', function(req, res) {
//     res.send('Your ngrok tunnel is up and running!');
// });

//Slack redirect URL challenge endpoint.
app.post('/challenge', function(req,res,error) {

	var string = JSON.stringify(req.body)
	console.log("string", string);

	res.set('Content-Type', 'text/plain')

	var challenge = {
    	"challenge": string
	}

	res.send(challenge)
})
