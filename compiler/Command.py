import sys
import os
import json
from time import perf_counter as cnt
import subprocess as subp

root = os.path.dirname(os.path.abspath(__file__))
isString = lambda s: str(type(s)) == "<class 'str'>"

def runCmd(args):
    try:
        usage_start = cnt()
        p1 = subp.run(args,capture_output=True,text=True,cwd=root+"/../Files",timeout=5)
        if p1.stderr and isString(p1.stderr):
            print(json.dumps({
                "Type": "Standard Error",
                "Message": p1.stderr,
                "Time": (cnt() - usage_start) * 1000
            }))
            raise p1.stderr
        elif p1.stdout and isString(p1.stdout):
            print(json.dumps({
                "Type": "Standard Output",
                "Message": p1.stdout,
                "Time": (cnt() - usage_start) * 1000
            }))
    except FileNotFoundError:
        print(json.dumps({
            "Type" : "Critical Error",
            "Message" : "File/Command Not Found"
        }))
    except subp.TimeoutExpired:
        print(json.dumps({
            "Type" : "Critical Error",
            "Message" : "Standard execution time exceeded"
        }))

def execute(args,inputs):
    try:
        usage_start = cnt()
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
                "Message": err,
                "Time": (cnt() - usage_start) * 1000
            }))
            raise err
        elif output and isString(output):
            print(json.dumps({
                "Type": "Standard Output",
                "Message": output,
                "Time": (cnt() - usage_start) * 1000
            }))
    except FileNotFoundError as err:
        print(json.dumps({
            "Type" : "Critical Error",
            "Message" : "File/Command Not Found"
        }))

if __name__ == "__main__":
    try:
        lang = sys.argv[1]
        inputs = sys.argv[2:-1]
        fileID = sys.argv[-1]
        if lang == "C":
            runCmd(['gcc',f'{fileID}.c','-std=c17','-o',fileID])
            if len(inputs) == 0:
                runCmd([f'./{fileID}'])
            else:
                execute([f'./{fileID}'],inputs)
        elif lang == "CPP":
            runCmd(['g++',f'{fileID}.cpp','-std=c++17','-o',fileID])
            if len(inputs) == 0:
                runCmd([f'./{fileID}'])
            else:
                execute([f'./{fileID}'],inputs)
        elif lang == "Python":
            if len(inputs) == 0:
                runCmd(['python3',f'{fileID}.py'])
            else:
                execute(['python3',f'{fileID}.py'],inputs)
        elif lang == "JS":
            if len(inputs) == 0:
                runCmd(['node',f'{fileID}.js'])
            else:
                execute(['node',f'{fileID}.js'],inputs)
        elif lang == "Java":
            if len(inputs) == 0:
                runCmd(['java',f'{fileID}.java'])
            else:
                execute(['java',f'{fileID}.java'],inputs)
    except Exception:
        pass
