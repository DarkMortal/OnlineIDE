const fs = require('fs');
const { Execute } = require('./execute');

function compile(code,lang,inputs,jobID){
    return new Promise((resolve,reject)=>{
        var ext = "";

        switch(lang){
            case "C" : ext = ".c"; break;
            case "CPP" : ext = ".cpp";  break;
            case "Python" : ext = ".py";  break;
            case "JS" : ext = ".js"; break;
            case "Java": ext = ".java"; break;
        }
        fs.writeFileSync(`./Files/${jobID+ext}`,code,err=>{
            if(err) reject(err);
            console.log("File created successfully");
        });
        Execute(lang,inputs,jobID)
        .then(res=>resolve([res,[jobID,ext]]))
        .catch(err=>reject([err,[jobID,ext]]));
})}

function Delete(filename){
    fs.unlinkSync('./Files/'+filename[0]+filename[1]);
    if(filename[1] == '.c' || filename[1] == '.cpp') fs.unlinkSync('./Files/'+filename[0]);
}

module.exports.compile = compile;
module.exports.Delete = Delete;