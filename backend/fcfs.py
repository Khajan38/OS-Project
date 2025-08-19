#Root Directory in System Path
import sys, os
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

import subprocess, json

def fcfs(processes):
    input_json = json.dumps(processes)
    proc = subprocess.run(
        ["dependencies/CPU-Scheduling-Algorithms/fcfs.out"],
        input=input_json,
        text=True,
        capture_output=True
    )
    return json.loads(proc.stdout)