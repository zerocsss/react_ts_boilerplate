import React from "react";
import logo from "./logo.svg";
import { Button, DatePicker } from "antd";
// import "./App.less";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DatePicker></DatePicker>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <Button type="primary">Button</Button>
          Edit <code>src/App.tsx</code> 22222 save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
