const key = {
    accessKeyId : 'ACCESS KEY',
    secretAccessKey: 'SECRET ACCESS KEY',
    region: 'REGION'
}
const aws = require('aws-sdk')
const polly = new aws.Polly(key)

exports.handler = function(req,ctx,callback){
    const text = req.text
    const params = {
        OutputFormat: 'mp3',
        OutputS3BucketName:'semi-proyecto-g9',
        Text:text,
        VoiceId:'Lupe',
        OutputS3KeyPrefix:'Audios/'

    }
    polly.startSpeechSynthesisTask(params,(err,data)=>{
        if(err){
            console.log(err);
            callback('err',err)

        }else{
            let uri = data.SynthesisTask.OutputUri
            console.log(uri);
            callback(null,uri)
        }
    })
}