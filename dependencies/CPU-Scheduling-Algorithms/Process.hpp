#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Process {
public:
    string id;
    int arrival, burst, priority;
    Process(string id, int arrival, int burst, int priority)
        : id(id), arrival(arrival), burst(burst), priority(priority) {}
};

class GanttValue {
public:
    string id;
    int start, end;
    GanttValue(string id, int start, int end) : id(id), start(start), end(end) {}
};

class ProcessStats {
public:
    string id;
    int waiting_time, turnaround_time, response_time;
    ProcessStats(string id, int waiting_time, int turnaround_time, int response_time)
        : id(id), waiting_time(waiting_time), turnaround_time(turnaround_time), response_time(response_time) {}
};

class Averages {
public:
    double avg_waiting, avg_turnaround, avg_response;
    int end_time;
    Averages(double avg_waiting, double avg_turnaround, double avg_response, int end_time)
        : avg_waiting(avg_waiting), avg_turnaround(avg_turnaround), avg_response(avg_response), end_time(end_time) {}
};

class Result {
public:
    vector<Process> processes;
    vector<GanttValue> gantt_chart;
    vector<ProcessStats> process_stats;
    Averages average;

    Result(vector<Process> p, vector<GanttValue> g, vector<ProcessStats> s, Averages a)
        : processes(p), gantt_chart(g), process_stats(s), average(a) {}
};