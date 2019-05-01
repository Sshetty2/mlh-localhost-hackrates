const Web3 = require('web3');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

// RPC endpoint
var etherUrl = process.env.ETHER_URL || "http://ethirgqw4-dns-reg1.eastus.cloudapp.azure.com:8540";
// from metamask senders ethereum address
var account = process.env.ACCOUNT_ADDRESS || "0x03A61f773a412c9dBd99Ae2c4f40dF6380Cc23CE";
var contract = process.env.CONTRACT_ADDRESS || "0xb0e5015db317b4a7402e9dfa99a04642745b8a79847b01e67152ab2f84a7b25a";

var httpPort = process.env.PORT || 3000;
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(etherUrl));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    console.log(req.method + " " + req.url);
    next();
});

app.use(express.static("public"));

app.get("/ratings", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/ratings.html"));
});

var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "projectID",
				"type": "uint256"
  			},
			{
				"name": "creativity",
				"type": "uint256"
			},
			{
				"name": "technicalComplexity",
				"type": "uint256"
			},
			{
				"name": "bestPractices",
				"type": "uint256"
			}
		],
		"name": "addRating",
		"outputs": [
			{
				"name": "ratingID",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getRating",
		"outputs": [
			{
				"name": "projectID",
				"type": "uint256"
			},
			{
				"name": "creativity",
				"type": "uint256"
			},
			{
				"name": "technicalComplexity",
				"type": "uint256"
			},
			{
				"name": "bestPractices",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getRatingsCount",
		"outputs": [
			{
				"name": "count",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "newRating",
		"type": "event"
	}
];

contractInstance = new web3.eth.Contract(abi, contract);

app.get("/count", function (req, res) {
	contractInstance.methods.getRatingsCount().call(function(error, count) {
		if (error) {
			res.status(500).send(error);
		}
		else {
			res.status = 200;
			res.json(count);
		}
	});
});

app.get("/rating/:index", function (req, res) {
	contractInstance.methods.getRating(parseInt(req.params.index)).call(function(error, rating) {
		if (error) {
			res.status(500).send(error);
		}
		else {
			res.status = 200;
			res.json({
				"projectID": parseInt(rating.projectID),
				"creativity": parseInt(rating.creativity),
        "technicalComplexity": parseInt(rating.technicalComplexity),
        "bestPractices": parseInt(rating.bestPractices)
			});
		}
	});
});

app.post("/add", function (req, res) {
  contractInstance.methods.addRating(
    parseInt(req.body.projectID),
    parseInt(req.body.creativity),
    parseInt(req.body.technicalComplexity),
    parseInt(req.body.bestPractices)
  ).send({ from: account, gas: 0 }, function(error, transactionHash) {
    if (error) {
      res.status(500).send(error)	;
    }
    else {
      res.status = 200;
      res.json({ id: 0 });
    }
  }).catch(function(err) {
    res.status(500).send(err)
  });
});

app.listen(httpPort, function () {
	console.log("Listening on port " + httpPort);
});
