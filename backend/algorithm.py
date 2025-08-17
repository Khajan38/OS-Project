import pandas as pd
from backend.fcfs import fcfs

def getProcesses(source, limit=None):
     if source is None: source = "processes1.csv"
     if limit is None: limit = 10
     limit = int(limit)
     df = pd.read_csv(f'backend/assets/{source}')
     if limit <= 0 or limit > 10: limit = 10;
     if limit is not None:
          df = df.head(limit)
     return df.to_dict(orient="records")

# 1: FCFS, 2: SJF, 3: Priority
def getAlgorithm (algorithm, noOfProcesses, source):
     processes = getProcesses(source, noOfProcesses)
     if algorithm is None: algorithm = "FCFS"
     if algorithm == 'FCFS': return fcfs(processes)
     elif algorithm == 'SJF': return fcfs(processes)
     elif algorithm == 'Priority': return fcfs(processes)
     else: return fcfs(processes)