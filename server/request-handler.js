/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.



// Request and Response come from node's http module.
//
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
//
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/

// Do some basic logging.
//
// Adding more logging to your server can be an easy way to get passive
// debugging help, but you should always be careful about leaving stray
// console.logs in your code.
// The outgoing status.
// See the note below about CORS headers.
// Tell the client we are sending them plain text.
//
// You will need to change this if you are sending something
// other than plain text, like JSON or HTML.

// .writeHead() writes to the request line and headers of the response,
// which includes the status and all headers.

// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.
const fs = require('fs');
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

// var array = [
//   { username: 'Test', roomname: 'Lobby', text: 'Test test'},
//   { username: 'Test', roomname: 'Lobby', text: 'Test test'},
//   { username: 'Test', roomname: 'Lobby', text: 'Test test'},
//   { username: 'Test', roomname: 'Lobby', text: 'Test test'},
//   { username: 'Test', roomname: 'Lobby', text: 'Test test'},
//   { username: 'Test', roomname: 'Lobby', text: 'Test test'},
//   { username: 'Test', roomname: 'Lobby', text: 'Test test'},
//   { username: 'Test', roomname: 'Lobby', text: 'Test test'},
//   { username: 'Test', roomname: 'Lobby', text: 'Test test'},
//   { username: 'Test', roomname: 'Lobby', text: 'Test test'},
// ];
// var messages = [];
var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  if (request.url !== '/classes/messages') {
    statusCode = 404;
  }
  if (request.method === 'GET' || request.method === 'OPTIONS') {
    try {
      var data = fs.readFileSync('server/messageData.txt', 'utf8');
      JSON.parse(data);
      data = data.split(/\r?\n/);
      data.pop();
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  }
  if (request.method === 'POST') {
    statusCode = 201;
    let body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      // console.log(typeof body);
      body = JSON.parse(body);
      // if (body.text.length === 0) {
      //   response.writeHead(400, headers);
      //   response.end();
      // }
      // else {
      try {
        fs.appendFileSync('server/messageData.txt', JSON.stringify(body) + '\n');
        console.log('The "data to append" was appended to file!');
      } catch (err) {
        console.error(err);
      }
      response.writeHead(201, headers);
      response.end();
      // }
    });

  }
};



module.exports.requestHandler = requestHandler;
// module.exports.updatedMessages = messages;
