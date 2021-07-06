const aws = require('aws-sdk')
const key = {
    accessKeyId:'ACCESS KEY',
    secretAccessKey : 'SECRET ACCESS KEY',
    region : 'REGION',
}
const trans = new aws.Translate(key)

exports.handler = function(req,ctx,callback){
    const titulo = req.titulo
    const texto = req.texto
    const language = req.idioma
    let output = 'es'
    if (language=='ingles') output = 'en'
    if(language == 'japones') output = 'ja'
    if(language=='frances') output = 'fr'
    if(language == 'aleman') output = 'de'
    if(language=='italiano') output = 'it'
    var params = {
        SourceLanguageCode:'es-MX',
        TargetLanguageCode:output,
        Text:titulo,
    }
    trans.translateText(params,(err,data)=>{
        if(err){
            console.log(err);
            callback('error',err)
        }else{
            const t = data
            var params2 = {
                SourceLanguageCode:'es-MX',
                TargetLanguageCode:output,
                Text:texto,
            }
            trans.translateText(params2,(err2,data2)=>{
                if(err2){
                    console.log(err);
                    callback('error',err)
                }else{
                    const reponse = {
                        titulo:t,
                        texto:data2
                    }
                    callback(null,reponse)
                }
            })
        }
    })
}