def fcfs(processes):
    temp = processes
    processes.sort(key=lambda x: x['arrival'])
    time = 0
    gantt_chart = []
    results = []

    for p in processes:
        start = max(time, p['arrival'])
        end = start + p['burst']
        time = end

        turnaround = end - p['arrival']
        waiting = turnaround - p['burst']
        response = start - p['arrival']

        gantt_chart.append({"process": p['id'], "start": start, "end": end})
        results.append({
            "id": p['id'],
            "waiting_time": waiting,
            "turnaround_time": turnaround,
            "response_time": response
        })

    avg_waiting = sum(r["waiting_time"] for r in results) / len(results)
    avg_turnaround = sum(r["turnaround_time"] for r in results) / len(results)

    return {
        "processes": temp,
        "gantt_chart": gantt_chart,
        "process_stats": results,
        "averages": {
            "avg_waiting": avg_waiting,
            "avg_turnaround": avg_turnaround,
            "end_time": time
        }
    }