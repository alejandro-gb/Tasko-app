const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const keys = {
    UserPoolId: 'USER POOL ID',
    ClientId: 'CLIENT ID'

}
const cognito = new AmazonCognitoIdentity.CognitoUserPool(keys);

exports.handler = function(req,ctx,callback){
    var authenticationData = {
        Username: req.username,
        Password: req.password
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );
    var userData = {
        Username: req.username,
        Pool: cognito,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log(result);
            callback(null,result)
        },
        onFailure: function (err) {
            console.log(err);
            callback('err',err)
        },
        mfaRequired: function (codeDeliveryDetails) {
            // MFA is required to complete user authentication.
            // Get the code from user and call
            cognitoUser.sendMFACode(verificationCode, this);
        },
    });
  




  
}