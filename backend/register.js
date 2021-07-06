const aws = require('aws-sdk')
const cognito = new aws.CognitoIdentityServiceProvider()
const keys = {
    accessKeyId : 'ACCESS KEY',
    secretAccessKey: 'SECRET ACCESS KEY',
    region: 'REGION'
}
const s3 = new aws.S3(keys)
const key = {
    UserPoolId: 'USER POOL ID',
    ClientId: 'CLIENT ID'
}


exports.handler = function (req, ctx, callback) {
    //Primero subimos la foto a S3
    let ruta = "Fotos_Perfil/"+req.username.toString()+"/"+makeid(8)
    const base64Data = new Buffer.from(req.picture.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    const type = req.picture.split(';')[0].split('/')[1];
    ruta+="."+type
    const params = {
        Bucket: "semi-proyecto-g9",
        Key: ruta,
        Body: base64Data,
        ContentType: `image/${type}`,
        ACL: 'public-read'
    }
    const putS3 = s3.putObject(params,(err,data)=>{
        if(err){
            console.log(err)
            callback('err',err)
        }else{
            let attributes = []
            const dataname = {
                Name: 'name',
                Value: req.name
            }
            attributes.push(dataname)
            var dataemail = {
                Name: 'email',
                Value: req.email,
            };
            attributes.push(dataemail)
            var databirthday = {
                Name: 'birthdate',
                Value: req.birthday,
            };
            attributes.push(databirthday)
            var datapic = {
                Name: 'picture',
                Value:ruta,
            };
            attributes.push(datapic)
            const params={
                ClientId:key.ClientId,
                Password:req.password,
                Username:req.username,
                UserAttributes:attributes
            }
            cognito.signUp(params,(err,data)=>{
                if(err){
                    console.log(err)
                    callback('err',err)
                }else{
                    console.log(data)
                    callback(null,data)
                }
            })
        }
    })
    


};

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}