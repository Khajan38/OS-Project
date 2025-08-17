import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Algorithm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const formData = {algorithm: queryParams.get("algorithm"), source: queryParams.get("source"), noOfProcesses: queryParams.get("noOfProcesses")};

  useEffect ( () => {
    async function fetchData(){
      const params = new URLSearchParams(formData).toString();
      const res = await axios.get(`${BASE_URL}/api/getData?${params}`);
      console.log(res.data);
    } fetchData();
  }, [])

  return (
    <div>
      <p>{formData.algorithm}</p>
      <p>{formData.source}</p>
      <p>{formData.noOfProcesses}</p>
    </div>
  )
}

export default Algorithm
