const aws = require('aws-sdk')
const keys = {
    accessKeyId:'ACCESS KEY',
    secretAccessKey:'SECRET ACCESS KEY',
    region:'REGION'
}
const db = new aws.DynamoDB(keys)

exports.handler = function(req,ctx,callback){
    const username = req.username
    const proyecto = req.proyecto
    const numero = req.numero
    var params = {
        Key:{
            "id":{
                S:username+'~'+proyecto+'~'+numero
            }
        },
        TableName:'Elemento'
    }
    db.deleteItem(params,(err,data)=>{
        if(err){
            console.log(err);
            callback('error',err)
        }else{
            callback(null,data)
        }
    })
}