const fs = require('fs');
const { Execute } = require('./execute');

function compile(code,lang,inputs){
    return new Promise((resolve,reject)=>{
        var ext = "";

        switch(lang){
            case "C" : ext = ".c"; break;
            case "CPP" : ext = ".cpp";  break;
            case "Python" : ext = ".py";  break;
            case "JS" : ext = ".js"; break;
            case "Java": ext = ".java"; break;
        }
        fs.writeFileSync("./Files/CodeFile"+ext,code,err=>{
            if(err) throw err;
            console.log("File created successfully");
        });
        setTimeout(()=>{
            Execute(lang,inputs)
            .then(res=>resolve(res))
            .catch(err=>reject(err));
        },1000);
})}

function DeleteAll(){
    fs.readdir('./Files/', (err, files) => {
        if (err) console.log(err);
        for (const file of files)  fs.unlinkSync('./Files/'+file);
    });
}

module.exports.compile = compile;
module.exports.DeleteAll = DeleteAll;