const aws = require('aws-sdk')
const keys = {
    accessKeyId:'ACCESS KEY',
    secretAccessKey:'SECRET ACCESS KEY',
    region:'REGION'
}
const db = new aws.DynamoDB(keys)
const keys2 = {
    accessKeyId : 'ACCESS KEY',
    secretAccessKey: 'SECRET ACCESS KEY',
    region: 'REGION'
}
const s3 = new aws.S3(keys2)

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.handler = function(req,ctx,callback){
    const tipo = req.tipo
    const numero = req.numero
    const username = req.username
    const proyecto = req.proyecto
    const id = username+'~'+proyecto+'~'+numero
    if(tipo == 'Nota'){
        const color = req.color
        const titulo = req.titulo
        const texto = req.texto
        const params = {
            TableName: 'Elemento',
            Item:{
                id:{
                    'S':id
                },
                username:{
                    'S':username
                },
                numero:{
                    'N':numero.toString()
                },
                color:{
                    'S':color
                },
                nombre:{
                    'S':''
                },
                src:{
                    'S':''
                },
                texto:{
                    'S':texto
                },
                tipo:{
                    'S':tipo
                },
                titulo:{
                    'S':titulo
                },
                proyecto:{
                    'S':proyecto
                }
            }
        }
        db.putItem(params,(err,data)=>{
            if(err){
                console.log(err);
                callback('error',err)
            }else{
                callback(null,data)
            }
        })
    }else if(tipo=='Imagen'){
        const titulo = req.titulo
        const src = req.src
        let ruta = "Fotos_Subidas/"+username.toString()+"/"+makeid(8)
        const base64Data = new Buffer.from(src.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        const type = src.split(';')[0].split('/')[1];
        ruta+="."+type
        const params = {
            Bucket: "semi-proyecto-g9",
            Key: ruta,
            Body: base64Data,
            ContentType: `image/${type}`,
            ACL: 'public-read'
        }
        const putres = s3.putObject(params,(err,data)=>{
            if(err){
                console.log(err);
                callback('err',err)
            }else{
                const params2 = {
                    TableName: 'Elemento',
                    Item:{
                        id:{
                            'S':id
                        },
                        username:{
                            'S':username
                        },
                        numero:{
                            'N':numero.toString()
                        },
                        color:{
                            'S':''
                        },
                        nombre:{
                            'S':''
                        },
                        src:{
                            'S':ruta
                        },
                        texto:{
                            'S':''
                        },
                        tipo:{
                            'S':tipo
                        },
                        titulo:{
                            'S':titulo
                        },
                        proyecto:{
                            'S':proyecto
                        }
                    }
                }
                db.putItem(params2,(err2,data2)=>{
                    if(err2){
                        console.log(err2);
                        callback('error',err2)
                    }else{
                        callback(null,data2)
                    }
                })
            }
        })
        

    }
}