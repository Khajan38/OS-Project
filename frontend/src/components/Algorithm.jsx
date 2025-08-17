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

  if (loading) return ( <>
    <div className="toast-overlay" />
    <div className="toast-message processing">Loading the Data...</div>
  </> ); if (errori) return (<>
    <div className="toast-overlay" onClick={() => setError(null)} />
    <div className="toast-message error" onClick={() => setError(null)}>{errori}</div>
  </> );

  return (
    <div className="cpu-scheduler" style={{ backgroundImage: `url(${bgImage})` }}>
      <h1>{formData.algorithm} Scheduling</h1> <h2>Simulation</h2>
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
    </div>
  );
};

export default Algorithm;