const AWS = require("aws-sdk");
const fs = require('fs');

// modify AWS config object to connect to the local instance of dynamodb
AWS.config.update({
    region: "us-east-2",
    endpoint: "http://localhost:8000"
});

// create the dynamodb service object
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

// read seed file and assign the object to allUsers
console.log("Importing thoughts into DynamoDB. Please wait.");
const allUsers = JSON.parse(fs.readFileSync('./server/seed/users.json', 'utf8'));

// loop over allUsers and create params object
allUsers.forEach(user => {
    const params = {
      TableName: "Thoughts",
      Item: {
        "username": user.username,
        "createdAt": user.createdAt,
        "thought": user.thought
      }
    };

    dynamodb.put(params, (err, data) => {
        if (err) {
          console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("PutItem succeeded:", user.username);
        }
    });
});
