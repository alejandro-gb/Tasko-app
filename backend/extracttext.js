const aws = require('aws-sdk')
const key = {
    accessKeyId : 'ACCESS KEY',
    secretAccessKey: 'SECRET ACCESS KEY',
    region: 'REGION'
}
const reko = new aws.Rekognition(key)

exports.handler = function(req,ctx,callback){
    const imagen = req.imagen
    const params = {
        S3Object:{
            Bucket: 'semi-proyecto-g9',
            Name: imagen,
        }
    }
    reko.detectText(params,(err,data)=>{
        if(err){
            console.log(err);
            callback('err',err)
        }else{
            let texts = data.TextDetections
            let results = []
            for(const t of texts){
                results.push(t.DetectedText)
            }
            callback(null,results)
        }
    })
}