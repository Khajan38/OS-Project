import { useState } from "react";
import bgImage from "./../assets/home_background.jpg";
import "./CSS/CPUScheduler.css";

const CPUScheduler = () => {
  const [formData, setFormData] = useState({algorithm: "", source: "", noOfProcesses: 0});
  const handleChange = (e) => {setFormData({ ...formData, [e.target.name]: e.target.value });};
  const fileModal = () => {
    const main = document.querySelector(".cpu-scheduler");
    fetch(`https://api.github.com/repos/Khajan38/OS-Project/contents/`)
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById("fileList");
        list.innerHTML = "";
        data.forEach(file => {
            if(file.type === "file"){
                const li = document.createElement("li");
                li.textContent = file.name;
                li.style.cursor = "pointer";
                li.onclick = () => {
                    alert(`Selected: ${file.name}\nURL: ${file.download_url}`);
                    closeModal();
                };
                list.appendChild(li);
            }
        });
        document.getElementById("fileModal").style.display = "block";
    })
    .catch(err => console.error(err));
    function closeModal(){document.getElementById("fileModal").style.display = "none";}
    const fileDialog = () => {
      return (
        <div id="fileModal">
          <div>
            <h2>Select a File</h2>
            <ul id="fileList"></ul>
            <button onclick= {closeModal()}>Close</button>
          </div>
        </div>
      );
    }
    main.after(fileDialog());
  };
  const chooseCPUScheduler = (e) => {
    e.preventDefault(); 
  }; 
  return (
    <div className="cpu-scheduler"  style={{ backgroundImage: `url(${bgImage})` }} >
      <h1>CPU Scheduling</h1> <h2>Simulation</h2>
      <form className='form-box' onSubmit={chooseCPUScheduler}>
        <div className="input-box">
          <label htmlFor="algorithm">Algorithm:</label>
          <select id="algorithm" name="algorithm" value={formData.algorithm} onChange={handleChange} required > 
            <option value="" disabled>Select Algorithm</option>
            <option value="FCFS">First Come First Serve</option>
            <option value="SJF">Shortest Job First</option>
            <option value="Priority">Priority Scheduling</option>
          </select>
        </div>
        <div className="input-box" style={{ gap: "49px" }}>
          <label htmlFor="source">Source:</label>
          <button id="source" className="btn" onClick={fileModal}> Browse </button>
        </div>
        <button className='btn' type="submit" disabled={formData.algorithm=='' || formData.source=='' || formData.noOfProcesses <= 0 || formData.noOfProcesses > 10}>Choose</button>
      </form>
    </div>
  );
};

export default CPUScheduler;
