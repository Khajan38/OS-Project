import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CPUScheduler from "./components/CPUScheduler";
import Algorithm from "./components/Algorithm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/os/cpu_scheduler" element={<CPUScheduler />} />
        <Route path="/os/cpu_scheduler/Algorithm" element={<Algorithm />} />
        <Route path="*" element={<Navigate to="/os/cpu_scheduler" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;