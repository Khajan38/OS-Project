import './CSS/Algo_Summary.css'

const Algo_Summary = ({ gantt_chart, processStats, endTime, averages }) => {
  const getProcessColor = (processName) => {
    const colors = ['#00e676', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f39c12', '#e74c3c'];
    const processNum = parseInt(processName.replace('P', ''));
    return colors[processNum % colors.length];
  }; if (!Array.isArray(gantt_chart)) {
    return <p>Invalid Gantt chart data.</p>;
  } if (gantt_chart.length === 0) {
    return <p>No Gantt chart data available.</p>;
  }
  return (
    <>
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
                  width: `${((item.end - item.start) / endTime) * 100}%`,
                }}
              >
                <span className="process-label">{item.process}</span>
                <span className="time-range">
                  {item.start}-{item.end}
                </span>
              </div>
            ))}
          </div>
          <div className="time-axis">
            {Array.from({ length: endTime }, (_, i) => (
              <span key={i} className="time-marker">
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>

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

      <div className="summary-section">
        <h3 className="section-title">Performance Metrics</h3>
        <div className="averages-grid">
          <div className="metric-card">
            <div className="metric-value">
              {averages.avg_waiting?.toFixed(2) || "N/A"}
            </div>
            <div className="metric-label">Average Waiting Time</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">
              {averages.avg_turnaround?.toFixed(2) || "N/A"}
            </div>
            <div className="metric-label">Average Turnaround Time</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">
              {averages.avg_response?.toFixed(2) || "N/A"}
            </div>
            <div className="metric-label">Average Response Time</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{endTime}</div>
            <div className="metric-label">Total Execution Time</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Algo_Summary;
