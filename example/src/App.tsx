import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useFindBookByIdUsingGetRequest } from "src/request/api";

function App() {
  const { data, isLoading } = useFindBookByIdUsingGetRequest({ id: "001" });

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <p>BookId: {data?.id}</p>
      <p>AuthorName: {data?.author_name}</p>
      <p>BookName: {data?.filename}</p>
    </div>
  );
}

export default App;
