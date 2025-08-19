import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './CSS/Algorithm.css'
import Algo_Summary from "./Algo_Summary";

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
        setEndTime(data.averages.end_time);
      } catch (error) { setError("Error fetching scheduling data"); console.error(error);}
      finally { setLoading(false); }
    } fetchData();
  }, []);

  useEffect(() => {
    if (!processes) return;
    const newLiveData = processes.map((value) => ({ process_name: value.id, priority: value.priority, remaining_burst: value.burst, waiting_time: 0, burstTime: value.burst, completed: false }));
    setLiveData(newLiveData);
  }, [processes, gantt_chart, endTime]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(prev => {
        if (prev >= endTime) { clearInterval(intervalId); return prev;}
        return prev + 0.25;
      });}, 250);
    return () => clearInterval(intervalId);
  }, [endTime]);

  useEffect(() => {
    if (!gantt_chart?.length || !liveData?.length) { setTimer(0); return; }
    if (gnatt_ind.current > gantt_chart.length - 1) return;
    const current = gantt_chart[gnatt_ind.current];
    if (!current) return;
    const process_id = parseInt(current.process.replace("P", ""), 10) - 1;
    setLiveData(prev => prev.map((p, idx) => {
      if (idx === process_id) {
        const remaining = p.remaining_burst - 0.25;
        return { ...p, remaining_burst: remaining, completed: remaining <= 0 };
      } else if (!p.completed && p.process_name !== current.process) {
        return { ...p, waiting_time: p.waiting_time + 0.25 };
      } return p;
    }));
    if (Math.abs(timer - current.end) < 1e-6) { gnatt_ind.current += 1; }
  }, [timer, gantt_chart]);

  if (loading) return ( <>
    <div className="toast-overlay" />
    <div className="toast-message processing">Loading the Data...</div>
  </> ); 
  
  if (errori) return (<>
    <div className="toast-overlay" onClick={() => setError(null)} />
    <div className="toast-message error" onClick={() => setError(null)}>{errori}</div>
  </> );

  return (
    <div className="cpu-scheduler" style={{ background: 'linear-gradient(135deg, #ACCDC6, #D2DDD5)', height: "auto" }}>
      <h1>{formData.algorithm} Scheduling</h1> <h2>Simulation</h2>
      <div style={{display: "flex", alignItems: "center", gap: "50px", margin: "0", padding: "0"}}>
        <div className="timer-display">Time: {parseInt(timer)}/{endTime}</div>
        {timer >= endTime && (
          <button className="view-summary-button" onClick={() => setShowSummary(!showSummary)} > {showSummary ? "Hide Summary" : "View Summary Report"} </button>)} 
      </div>
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
              <td>{parseInt(p.remaining_burst)}</td>
              <td>{parseInt(p.waiting_time)}</td>
            </tr>
          ))}
        </tbody>
      </table>{showSummary && timer >= endTime && (<Algo_Summary {...{ gantt_chart, processStats, endTime, averages }} />)}
    </div>
  );
};

export default Algorithm;