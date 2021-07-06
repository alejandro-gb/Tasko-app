const aws = require('aws-sdk')
const keys = {
    accessKeyId:'ACCESS KEY',
    secretAccessKey:'SECRET ACCESS KEY',
    region:'REGION'
}
const db = new aws.DynamoDB(keys)

exports.handler = function(req,ctx,callback){
    const username = req.username
    const params = {
        TableName:'Proyectos',

    }
    db.scan(params,(err,data)=>{
        if(err){
            console.log(err);
            callback('error',err)
        }else{
            const items = data.Items
            let results = []
            for(let item of items){
                if (item.username.S == username){
                    results.push(item)
                }
            }
            callback(null,results)
        }
    })
}

