const fs = require("fs")
const { exec } = require("child_process");

function Execute(lang,inputs){
    return new Promise(function(resolve, reject) {
        const exec_options = {
            cwd : __dirname,
            timeout : 5500 ,
            killSignal : "SIGTERM",
            stdio: 'pipe',
            detached: true
        };

        var command = "python3 Command.py "+lang;
        if(inputs) for(let i=0;i<inputs.length;i++) command += (" "+(inputs[i]).toString());

        //console.log(command);
        
        exec(command,exec_options,(err,stdout,stderr)=>{
            if(stdout) resolve(JSON.parse(stdout));
            if(stdout === "") reject({
                "Type" : "Critical Error",
                "Message": "No output received from Server"
            })
            if(stderr) console.log(stderr);
            if(err) reject({
                "Type" : "Critical Error",
                "Message": "Standard Execution Time Exceeded"
            });
        });
    });
}

module.exports.Execute = Execute;