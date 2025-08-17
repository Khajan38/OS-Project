import { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "./../assets/home_background.jpg";
import "./CSS/CPUScheduler.css";
import { useRef } from "react";

const CPUScheduler = () => {
  const [formData, setFormData] = useState({algorithm: "", source: "", noOfProcesses: 0});
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const default_text = `Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows\n`;

  const handleChange = (e) => {setFormData({ ...formData, [e.target.name]: e.target.value });};
  const fileModal = async () => {
    try {
      const res = await axios.get("https://api.github.com/repos/Khajan38/OS-Project/contents/backend/assets");
      const fileList = res.data.filter((file) => file.type === "file");
      setFiles(fileList);
      setShowModal(true);
    } catch (err) { console.error(err); }
  };
  const focusInput = () => { inputRef.current?.focus(); };
  useEffect(() => {

  }, [])
  const chooseCPUScheduler = (e) => {
    e.preventDefault();
    console.log(formData);
  }; 
  return (
    <div className="cpu-scheduler"  style={{ backgroundImage: `url(${bgImage})` }} >
      <h1>CPU Scheduling</h1> <h2>Simulation</h2>
      <div className="container">
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
          <div className="input-box" style={{ gap: "48px" }}>
            <label htmlFor="source">Source:</label>
            <button type="button" id="source" className="btn" onClick={fileModal}> Browse </button>
            {showModal && (
            <div id="fileModal" className="modal">
              <div className="modal-content" >
                <h2 style={{margin: "0 0 15px"}}>Select a File</h2>
                <ul>{files.map((file) => (
                  <li key={file.name} style={{ cursor: "pointer" }} onClick={() => { setFormData({ ...formData, source: file.download_url }); setShowModal(false);}}> {file.name} </li>
                ))}</ul>
                <button className='btn' type="button" style={{width: "100px", margin: "10px"}} onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>)}
          </div>
          <div className="input-box"  style={{ gap: "18px" }}>
            <label htmlFor="noOfProcesses">Processes:</label>
            <input type="number" id="noOfProcesses" name="noOfProcesses" min="1" max="10" value={formData.noOfProcesses} onChange={handleChange} required />
          </div>
          <button className='btn' type="submit" disabled={formData.algorithm=='' || formData.source=='' || formData.noOfProcesses <= 0 || formData.noOfProcesses > 10}>Choose</button>
        </form>
        <div className="terminal" onClick={focusInput}>
          <pre>{default_text}</pre> <br />
          <span>PS &gt; </span>
          <input ref={inputRef} type="text" />
        </div>
      </div>
    </div>
  );
};

export default CPUScheduler;
