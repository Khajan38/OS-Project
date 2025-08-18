import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './CSS/Algorithm.css'
import bgImage from "./../assets/home_background.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Algorithm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const formData = {
    algorithm: queryParams.get("algorithm"),
    source: queryParams.get("source"),
    noOfProcesses: queryParams.get("noOfProcesses"),
  };
  const [loading, setLoading] = useState(true);
  const [errori, setError] = useState(false);

  const [endTime, setEndTime] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [gantt_chart, setGanttChart] = useState([]);
  const [processStats, setStats] = useState([]);
  const [averages, setAverages] = useState({});

  const [liveData, setLiveData] = useState([]);
  const [timer, setTimer] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  let gnatt_ind = useRef(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams(formData).toString();
        const { data } = await axios.get(`${BASE_URL}/api/getData?${params}`);
        setProcesses(data.processes);
        setGanttChart(data.gantt_chart);
        setStats(data.process_stats);
        setAverages(data.averages);
        setEndTime(data.averages.end_time + 1);
      } catch (error) { setError("Error fetching scheduling data"); console.log(error);}
      finally { setLoading(false); }
    } fetchData();
  }, []);

  useEffect(() => {
    if (!processes) return;
    const newLiveData = processes.map((value) => ({ process_name: value.id, priority: value.priority, remaining_burst: value.burst, waiting_time: 0, burstTime: value.burst, completed: false }));
    setLiveData(newLiveData);
    console.log(gantt_chart);
  }, [processes, gantt_chart, endTime]);

  useEffect(() => {
    if (timer >= endTime) return;
    const intervalId = setInterval(() => { setTimer(prev => prev + 1); }, 1000);
    return () => clearInterval(intervalId);
  }, [timer, endTime]);

  useEffect(() => {
    if (!gantt_chart || gantt_chart.length === 0) return;
    if (!liveData || liveData.length === 0) return;
    if (gnatt_ind > gantt_chart.length - 1) return;
    const current = gantt_chart[gnatt_ind.current];
    if (!current) return;
    let process_id = parseInt(current.process.replace("P", ""), 10) - 1;
    liveData[process_id].remaining_burst -= 1;
    if (liveData[process_id].remaining_burst == 0) 
      liveData[process_id].completed = true;
    for (const value of liveData){
      if (!value.completed && value.process_name !== current.process) value.waiting_time += 1;
    } if (timer == current.end) { gnatt_ind.current += 1; }
  }, [timer, gantt_chart]);



  const getProcessColor = (processName) => {
    const colors = ['#00e676', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f39c12', '#e74c3c'];
    const processNum = parseInt(processName.replace('P', ''));
    return colors[processNum % colors.length];
  };

  if (loading) return ( <>
    <div className="toast-overlay" />
    <div className="toast-message processing">Loading the Data...</div>
  </> ); 
  
  if (errori) return (<>
    <div className="toast-overlay" onClick={() => setError(null)} />
    <div className="toast-message error" onClick={() => setError(null)}>{errori}</div>
  </> );



  return (
    <div className="cpu-scheduler" style={{ backgroundImage: `url(${bgImage})` }}>
      <h1>{formData.algorithm} Scheduling</h1> 
      <h2>Simulation</h2>
      <div className="timer-display">Time: {timer}/{endTime - 1}</div>
      <table className="livePreview">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Process</th>
            <th>Status Bar</th>
            <th>Remaining Burst Time</th>
            <th>Waiting Time</th>
          </tr>
        </thead>
        <tbody>
          {liveData.map((p, index) => (
            <tr key={index}>
              <td>{p.priority ?? "-"}</td>
              <td>{p.process_name ?? `P${index + 1}`}</td>
              <td><div className="statusbar"><div id={p.process_name} className="progress" style={{ width: `${((p.burstTime - p.remaining_burst) / p.burstTime) * 100}%`, }} /></div> </td>
              <td>{p.remaining_burst}</td>
              <td>{p.waiting_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {timer >= endTime && (
        <button 
          className="view-summary-button"
          onClick={() => setShowSummary(!showSummary)}
        >
          {showSummary ? "Hide Summary" : "View Summary Report"}
        </button>
      )}

      {showSummary && timer >= endTime && (
        <>
          {/* Gantt Chart Section */}
          <div className="summary-section">
            <h3 className="section-title">Gantt Chart</h3>
            <div className="gantt-container">
              <div className="gantt-chart">
                {gantt_chart.map((item, index) => (
                  <div
                    key={index}
                    className="gantt-item"
                    style={{
                      backgroundColor: getProcessColor(item.process),
                      width: `${((item.end - item.start) / endTime) * 100}%`
                    }}
                  >
                    <span className="process-label">{item.process}</span>
                    <span className="time-range">{item.start}-{item.end}</span>
                  </div>
                ))}
              </div>
              <div className="time-axis">
                {Array.from({ length: endTime }, (_, i) => (
                  <span key={i} className="time-marker">{i}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Process Statistics Table */}
          <div className="summary-section">
            <h3 className="section-title">Process Statistics</h3>
            <table className="livePreview summary-table">
              <thead>
                <tr>
                  <th>Process ID</th>
                  <th>Waiting Time</th>
                  <th>Turnaround Time</th>
                  <th>Response Time</th>
                </tr>
              </thead>
              <tbody>
                {processStats.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.id}</td>
                    <td>{stat.waiting_time}</td>
                    <td>{stat.turnaround_time}</td>
                    <td>{stat.response_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Averages Section */}
          <div className="summary-section">
            <h3 className="section-title">Performance Metrics</h3>
            <div className="averages-grid">
              <div className="metric-card">
                <div className="metric-value">{averages.avg_waiting?.toFixed(2) || 'N/A'}</div>
                <div className="metric-label">Average Waiting Time</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{averages.avg_turnaround?.toFixed(2) || 'N/A'}</div>
                <div className="metric-label">Average Turnaround Time</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{averages.avg_response?.toFixed(2) || 'N/A'}</div>
                <div className="metric-label">Average Response Time</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{endTime - 1}</div>
                <div className="metric-label">Total Execution Time</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Algorithm;