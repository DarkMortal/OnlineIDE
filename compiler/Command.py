import sys
import os
import json
import subprocess as subp

root = os.path.dirname(os.path.abspath(__file__))
isString = lambda s: str(type(s)) == "<class 'str'>"

def runCmd(args):
    try:
        p1 = subp.run(args,capture_output=True,text=True,cwd=root+"/../Files",timeout=5)
        if p1.stderr and isString(p1.stderr):
            print(json.dumps({
                "Type": "Standard Error",
                "Message": p1.stderr
            }))
            raise p1.stderr
        elif p1.stdout and isString(p1.stdout):
            print(json.dumps({
                "Type": "Standard Output",
                "Message": p1.stdout
            }))
    except FileNotFoundError:
        print(json.dumps({
            "Type" : "Critical Error",
            "Message" : "File/Command Not Found"
        }))
    except subp.TimeoutExpired:
        print(json.dumps({
            "Type" : "Critical Error",
            "Message" : "Starndard execution time exceeded"
        }))

def execute(args,inputs):
    try:
        p1 = subp.Popen(args, stdout=subp.PIPE, stderr=subp.PIPE, stdin=subp.PIPE, text=True, cwd=root+"/../Files")
        for i in inputs:
            inp = str(i) + '\n'
            p1.stdin.write(inp)
            p1.stdin.flush()
        err = p1.stderr.read()
        output = p1.stdout.read().strip()
        if err and isString(err):
            print(json.dumps({
                "Type": "Standard Error",
                "Message": err
            }))
            raise err
        elif output and isString(output):
            print(json.dumps({
                "Type": "Standard Output",
                "Message": output
            }))
    except FileNotFoundError as err:
        print(json.dumps({
            "Type" : "Critical Error",
            "Message" : "File/Command Not Found"
        }))

if __name__ == "__main__":
    try:
        lang = sys.argv[1]
        inputs = sys.argv[2:len(sys.argv)]
        if lang == "C":
            runCmd(['gcc','CodeFile.c','-std=c17'])
            if len(inputs) == 0:
                runCmd(['./a.out'])
            else:
                execute(['./a.out'],inputs)
        elif lang == "CPP":
            runCmd(['g++','CodeFile.cpp','-std=c++17'])
            if len(inputs) == 0:
                runCmd(['./a.out'])
            else:
                execute(['./a.out'],inputs)
        elif lang == "Python":
            if len(inputs) == 0:
                runCmd(['python3','CodeFile.py'])
            else:
                execute(['python3','CodeFile.py'],inputs)
        elif lang == "JS":
            if len(inputs) == 0:
                runCmd(['node','CodeFile.js'])
            else:
                execute(['node','CodeFile.js'],inputs)
        elif lang == "Java":
            if len(inputs) == 0:
                runCmd(['java','CodeFile.java'])
            else:
                execute(['java','CodeFile.java'],inputs)
    except Exception:
        pass
