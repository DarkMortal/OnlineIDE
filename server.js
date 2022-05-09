const express = require('express');
const http = require('http');
const { compile, DeleteAll } = require('./compiler/compiler')

const app = express();
const server= http.createServer(app);
var PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname));

app.post("/compile", (req,res)=>{
    var lang = req.body.lang,
    code = req.body.code,
    inputs = req.body.inputs;
    
    /*Compiling the Code and r=sending the result*/
    compile(code,lang,inputs).then(data=>{
        DeleteAll();
        res.json(data);
    }).catch(err=>{
        DeleteAll();
        res.json(err);
    });
});

app.get("/", (req,res)=>{
    res.sendFile("./index.html",{ root: __dirname });
});

server.listen(PORT, function(){
    console.log("Server is Running on Port : "+PORT);
});