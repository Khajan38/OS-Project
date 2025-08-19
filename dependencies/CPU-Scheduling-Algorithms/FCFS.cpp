#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include "Process.hpp"
#include "json.hpp"
using json = nlohmann::json;
using namespace std;

Result FCFS(vector<Process> processes) {
    vector<Process> temp(processes.begin(), processes.end());
    sort(processes.begin(), processes.end(), [](auto &a, auto &b) {
        return a.arrival < b.arrival;
    });
    int time = 0;
    vector<GanttValue> gantt_chart;
    vector<ProcessStats> results;

    long long total_waiting = 0, total_turnaround = 0, total_response = 0;

    for (auto &p : processes) {
        int start = max(time, p.arrival);
        int end = start + p.burst;
        time = end;

        int turnaround = end - p.arrival;
        int waiting = turnaround - p.burst;
        int response = start - p.arrival;

        gantt_chart.push_back(GanttValue(p.id, start, end));
        results.push_back(ProcessStats(p.id, waiting, turnaround, response));

        total_waiting += waiting;
        total_turnaround += turnaround;
        total_response += response;
    }

    int n = results.size();
    Averages averages(
        (double)total_waiting / n,
        (double)total_turnaround / n,
        (double)total_response / n,
        time
    );

    return Result(temp, gantt_chart, results, averages);
}

int main() {
    json input;
    cin >> input;
    vector<Process> processes;
    for (auto &p : input) {
        processes.push_back(Process(
            p["id"], p["arrival"], p["burst"], p.value("priority", 0)
        ));
    }
    Result result = FCFS(processes);
    json output;
    output["processes"] = json::array();
    for (auto &p : result.processes) {
        output["processes"].push_back({
            {"id", p.id},
            {"arrival", p.arrival},
            {"burst", p.burst},
            {"priority", p.priority}
        });
    }

    output["gantt_chart"] = json::array();
    for (auto &g : result.gantt_chart) {
        output["gantt_chart"].push_back({
            {"process", g.id},
            {"start", g.start},
            {"end", g.end}
        });
    }
    output["process_stats"] = json::array();
    for (auto &s : result.process_stats) {
        output["process_stats"].push_back({
            {"id", s.id},
            {"waiting_time", s.waiting_time},
            {"turnaround_time", s.turnaround_time},
            {"response_time", s.response_time}
        });
    }
    output["averages"] = {
        {"avg_waiting", result.average.avg_waiting},
        {"avg_turnaround", result.average.avg_turnaround},
        {"avg_response", result.average.avg_response},
        {"end_time", result.average.end_time}
    };
    cout << output.dump() << endl;
    return 0;
}