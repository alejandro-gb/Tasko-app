const aws = require('aws-sdk')
const keys = {
    accessKeyId:'ACCESS KEY',
    secretAccessKey:'SECRET ACCESS KEY',
    region:'REGION'
}
const db = new aws.DynamoDB(keys)

exports.handler = function(req,ctx,callback){
    let username = req.username
    let project = req.project
    const params = {
        Item:{
            'username':{
                'S':username
            },
            'project':{
                'S':project
            }
        },
        TableName:'Proyectos'
    }
    db.putItem(params,(err,data)=>{
        if(err){
            callback('error',err)
        }else{
            callback(null,data)
        }
    })
}