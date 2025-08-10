import pandas as pd
from fcfs import fcfs

def getProcesses (i):
     df = pd.read_csv(f'backend/processes{i}.csv')
     return df.to_dict(orient="records")

# 1: fcfs, 2: sjf, 3: rr, 4: priority
def getAlgorithm (i, j):
     if j == 1: print(fcfs(getProcesses(i)))

getAlgorithm(1, 1)