var express = require('express');
var app = express();

app.use(express.static('./'));

app.listen(1234);

console.log('your app is listening on port 1234');