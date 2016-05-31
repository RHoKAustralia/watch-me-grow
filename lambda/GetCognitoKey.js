var https = require('https');
var AWS = require('aws-sdk');

console.log('Loading function');

exports.handler = function(event, context) {
    var email = event.email;
    var token = event.token;
    var identityId = event.identityId;
    
    console.log('attempted login with email ' + email + ' and token ' + token + ' and identityid ' + identityId);
    
    get('/graph/me.json', {'access_token': token})    
        .then(function(result) {
            if (result.email !== email) {
                throw new Error('Attempted to logon with ' + email + ' but that did not match the token provided');
            }
        }).then(function() {
            var cognitoidentity = new AWS.CognitoIdentity();
            
            var params = {
              IdentityPoolId: 'us-east-1:e6b4594e-c060-4fbe-81dc-0d56af9b8ad3',
              Logins: {
                  'dailycred.watchmegrow': email
              }
            };
            
            if (identityId) {
                params.IdentityId = identityId;
            }
            
            return new Promise(function(resolve, reject) {
                cognitoidentity.getOpenIdTokenForDeveloperIdentity(params, function(err, data) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(data);  
                  }
                });
            });
        }).then(function(data) {
            try {
                context.done(null, data);    
            } catch(e) {
                console.error(e);
            context.fail('FAILURE');
            }
        }).catch(function(err) {
            console.error(err);
            context.fail('FAILURE');
        });
};

function get(path, data) {
    return new Promise(function(resolve, reject) {
        var queryString = Object.keys(data).map(function(key) { return key + '=' + data[key]}).join('&');
        var req = https.get('https://www.dailycred.com' + path + '?' + queryString, function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                if (response.statusCode === 200) {
                    var parsed = JSON.parse(body);
                    resolve(parsed);
                } else {
                    reject(body);
                }
            });
        });
        req.end();
    });
}