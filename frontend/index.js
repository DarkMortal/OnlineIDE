let editor = ace.edit("code"),
output = document.getElementById("output");

window.onload = ()=>{
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/c_cpp");
    document.getElementById("theme").selectedIndex = 0;
    document.getElementById("lang").selectedIndex = 1;
}

function getInputs(){
    let inp = document.getElementById('inputs').value;
    let lines = inp.trim().split("\n");
    return lines;
}

const langs = {
    "C" : "c",
    "C++" : "c_cpp",
    "Python 3" : "python",
    "Node JS" : "javascript",
    "Java (JDK-17)" : "java"
}

let mode = "c_cpp" , isCompiling = false;

function setIDETheme(sel) {
    var text = sel.options[sel.selectedIndex].text;
    if(text === "Clouds midnight") editor.setTheme("ace/theme/clouds_midnight");
    else editor.setTheme("ace/theme/"+text.toLowerCase());
}

function setLang(sel){
    var text = sel.options[sel.selectedIndex].text;
    editor.session.setMode("ace/mode/"+langs[text]);
    mode = langs[text];
}

document.getElementById('run_code').addEventListener('click',(evt)=>{
    evt.target.disabled = true;
    let annotations = editor.getSession().getAnnotations(), isError = false;
    for(let i = 0; i < annotations.length; i++){
        if(annotations[i].type === "error"){
            isError = true; break;
        }
    }
    if(isError){
        output.style.color = "red";
        output.innerText = "Invalid syntax. Please check your code";
        evt.target.disabled = isCompiling = false; return;
    }
    output.innerText = "Compiling...";
    if(!isCompiling){
        var language = "";
        isCompiling = true;
        switch(mode){
            case "c": language = "C"; break;
            case "c_cpp" : language = "CPP"; break;
            case "python" : language = "Python"; break;
            case "javascript" : language = "JS"; break;
            case "java" : language = "Java"; break;
        }
        var config = {
            method: 'POST',
            mode: 'same-origin',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({
                lang : language,
                code : editor.session.getValue(),
                inputs : getInputs()
            })
        };
        
        fetch("/compile",config).then(res=>{
            res.json().then(data=>{
                if(data.Type === "Critical Error" 
                || data.Type === "Standard Error") output.style.color = "red";
                else output.style.color = "greenyellow";
                output.innerText = data.Message.replace(/ /g,'\u00a0');
                if(data.Time) output.innerText += `\n\nTime taken: ${data.Time} ms`;
                evt.target.disabled = isCompiling = false;
            }).catch(err=>{
                evt.target.disabled = isCompiling = false;
                console.error(err);
                output.style.color = "red";
                output.innerText = "Invalid response received from server";
            });
        }).catch(err=>{
            evt.target.disabled = isCompiling = false;
            console.error(err);
            output.style.color = "red";
            output.innerText = "Invalid response received from server";
        });
    }else alert("Already compiling...");
});