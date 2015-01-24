var schedule = require('node-schedule');
var AWS = require('aws-sdk');
var helpers = require("./helpers");
var simpleDB = require("./simpleDB");
var Policy = require("./s3post").Policy;

var s3 = new AWS.S3();

var POLICY_FILE = "policy.json";
var Worker = function(sqsCommnad){
	
	var queue = sqsCommnad;

	Worker.prototype.job = function(){
		var run = schedule.scheduleJob('* * * * *',
			function(){
				queue.recv(function(err, data){
					if(err) { console.log(err); return; }
					//TODO 
					//Pibieranie pliku z S3 i zapis do simppleDB info o pliku.
					console.log({Body : data.Body, MD5OfBody : data.MD5OfBody});
					var key = data.Body;
					s3.getObject(init(key), function(err, data) {
					    if (err) {
					      console.log(err, err.stack); // an error occurred
					    }
					    else {
					        console.log("Success download object from S3");
					        simpleDB.putUpladedMetadata(key, data);
					      }
					    });
				});
			});
		
	}

	function init(key) {
  		var policyData = helpers.readJSONFile(POLICY_FILE);
	  	var policy = new Policy(policyData);
	  
	  	var params = {
		    Bucket:  policy.getConditionValueByKey("bucket"),
		    Key: key
		  };
	  	return params;
	}

}

module.exports = Worker;
