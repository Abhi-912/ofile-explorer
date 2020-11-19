//require node modules
const http = require('http');

//file imports
const respond = require('./lib/respond.js');

//connection settings
const port = process.env.PORT || 3000; //If we are going to deploy the app then we will require the environment variables.

//Create server
const server = http.createServer(respond);

//listen to client requests on the specific port, the port should be available
server.listen(port ,function(){
	console.log(`we are up @ : ${port}`);
});
