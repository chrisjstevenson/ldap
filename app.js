var express = require('express'),
    morgan = require('morgan'),
    colors = require('colors'),
    bodyParser = require('body-parser'),
    ActiveDirectory = require('activedirectory'),
    methodOverride = require('method-override'),               // simulate DELETE and PUT (express4)
    config = require('./config/config');

var app = express();

app.use(express.static(__dirname + '/assets'));                 // set the static file location
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true' }));          // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get('/api/auth', function(req, res) {
   res.send('200 OK')
});

app.post('/api/auth', function(req, res) {
    var query = 'cn=' + req.body.lastName + '*';
    var email = config.username;
    var password = config.password;
    var ad = new ActiveDirectory({
        url: config.url,
        baseDN: config.baseDN,
        username: email,
        password: password
    });

    ad.authenticate(email, password, function (error, auth) {
        if (error) {
            console.log(error);
        }
        else if (!auth) {
            res.send(400, 'Invalid username or password');
        }
        else {
            ad.findUsers(query, false, function (error, users) { // Get more info from AD
                if (error || !users) {
                    if (error) console.log(error);
                    res.send(400, 'Invalid username or password')
                }

                //fullName = /(\w+)[,\s]*(\w+)/g.exec(adUser.cn);
                res.send(users);
            });
        }
    });
});

var server = app.listen(3000, function () {
  console.log('Listening at port %s'.blue, server.address().port);
});