const aws = require('aws-sdk')
const cognito = new aws.CognitoIdentityServiceProvider()
const key = {
    ClientId: 'CLIENT ID'
}

exports.handler = function(req,ctx,callback){
    const params = {
        ClientId:key.ClientId,
        ConfirmationCode:req.code.toString(),
        Username:req.username
    }
    cognito.confirmSignUp(params,(err,data)=>{
        if(err){
            console.log(err)
            callback('error',err)
        }else{
            console.log(data);
            callback(null,data)
        }
    })
}