import { useEffect, useState, useRef } from "react";
import './CSS/Terminal.css'

const Terminal = ({ formData }) => {
  const inputRef = useRef(null);
  const default_text = `Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.
  
Install the latest PowerShell for new features and improvements!
`;
  const [algoText, setAlgoText] = useState("");

  const focusInput = () => { inputRef.current?.focus(); };
  useEffect(() => {
    if (formData.algorithm == "") return;
    fetch(`/${formData.algorithm}.txt`)
      .then((res) => res.text())
      .then((data) => setAlgoText(data + '\n\nPS > '));
  }, [formData.algorithm])

  return (
    <div className="terminal" onClick={focusInput}>
      <pre>{default_text}
        <a className="terminalLink" href="https://aka.ms/PSWindows" target="_blank" >https://aka.ms/PSWindows</a>
      </pre><br/>
      <span>PS &gt; </span> <pre>{algoText}</pre>
      <input ref={inputRef} type="text" />
    </div>
  );
};

export default Terminal;
