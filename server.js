const express = require('express');
const http = require('http');
const uuid = require('uuid');
const { compile, Delete } = require('./compiler/compiler')

const app = express();
const server= http.createServer(app);
var PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname+"/frontend"));

app.post("/compile", (req,res)=>{
    var lang = req.body.lang,
    code = req.body.code,
    inputs = req.body.inputs;
    let jobID = uuid.v4();
    
    /*TODO: Compiling the Code and resending the result*/
    compile(code,lang,inputs,jobID).then(data=>{
        Delete(data[1]);
        res.json(data[0]);
    }).catch(err=>res.json(err));
});

app.get("/", (req,res)=>{
    res.sendFile("./index.html",{ root: __dirname+"/frontend" });
});

server.listen(PORT, function(){
    console.log("Server is Running on Port : "+PORT);
});