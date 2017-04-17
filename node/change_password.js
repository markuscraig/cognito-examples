var AWS = require('aws-sdk');
var AWSCognito = require('amazon-cognito-identity-js');

// mock the navigator which is used by the Cognito JS SDK
global.navigator = () => null;

var authenticationData = {
    Username : 'markus.craig@gmail.com',
    Password : 'Appo7ite8$',
};

var authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);
console.log("auth details = " + authenticationDetails);

var poolData = {
    UserPoolId : 'us-east-1_djzEM0kmK',
    ClientId : '6uftii08ljg6n8ml6eu6qitb0c' // fithub mobile app id
};
var userPool = new AWSCognito.CognitoUserPool(poolData);

var userData = {
    Username : 'markus.craig@gmail.com',
    Pool : userPool
};
var cognitoUser = new AWSCognito.CognitoUser(userData);

cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
        // User authentication was successful
        console.log("AUTH SUCCESSFUL");

        console.log('access token = ' + result.getAccessToken().getJwtToken());
        /*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer*/
        console.log('idToken + ' + result.idToken.jwtToken);
    },

    onFailure: function(err) {
        // User authentication was not successful
        console.log("AUTH FAILED: err = " + err);
    },

    mfaRequired: function(codeDeliveryDetails) {
        // MFA is required to complete user authentication.
        // Get the code from user and call
        console.log("MFA REQUIRED: SENDING MFA CODE" + err);
        cognitoUser.sendMFACode("abc123", this)
    },

    newPasswordRequired: function(userAttributes, requiredAttributes) {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.
        console.log("NEW PASSWORD REQUIRED");

        // the api doesn't accept this field back
        console.log("USER ATTRIBS = " + JSON.stringify(userAttributes));
        delete userAttributes.email_verified;

        // create the user attributes for changing the password (does not accept 'email_verified')
        pwChangeUserAttribs = {
            phone_number: "+14084722884",
            email: "markus.craig@gmail.com"
        };

        // Get these details and call
        cognitoUser.completeNewPasswordChallenge("Appo7ite", pwChangeUserAttribs, this);
    }
});
