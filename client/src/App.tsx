import React, { useState, useEffect } from "react";
import "./App.css";
import { API } from "./utils/API";
import { Link } from "react-router-dom";

const api = new API("/api");

interface Index {
  number: string;
}

const App: React.FC = () => {
  const _values = {
    calculatedIndexes: [] as Array<Index>,
    storedValues: {} as { [key: string]: string },
    index: ""
  };
  const [{ index, calculatedIndexes, storedValues }, setValues] = useState(
    _values
  );

  const updateContent = async () => {
    const newIndexes = await api.getIndexes();
    const newValues = await api.getValues();

    if (newIndexes && newIndexes.length) {
      newIndexes.sort(
        (a: Index, b: Index) => parseInt(a.number, 10) - parseInt(b.number, 10)
      );

      setValues(values => ({
        ...values,
        calculatedIndexes: newIndexes,
        storedValues: newValues
      }));
    }
  };

  useEffect(() => {
    updateContent();
  }, []);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const index = evt.target.value;
    setValues(values => ({ ...values, index }));
  };

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    await api.setValues(index);
    await updateContent();

    setValues(values => ({ ...values, index: "" }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fibonacci Sequence Calculator</h1>
        <Link to="anotherpage">Another Page</Link>
        <form onSubmit={handleSubmit}>
          <input
            value={index}
            onChange={handleChange}
            className="index-input"
            placeholder="Index"
            name="index"
          />
          <button type="submit" className="calculate button">
            Calculate
          </button>
        </form>
        <div className="content">
          <div className="child">
            <h4 className="title">Postgres Calculated Indexes</h4>
            {calculatedIndexes && calculatedIndexes.length
              ? calculatedIndexes.map((index, i) => (
                  <div key={i}>
                    <code>{index.number}</code>
                  </div>
                ))
              : null}
          </div>
          <div className="child">
            <h4 className="title">Redis Stored Values</h4>
            {Object.keys(storedValues).length
              ? Object.keys(storedValues).map((key, i) => (
                  <div key={i}>
                    <code>
                      Fib({key}) = {storedValues[key]}
                    </code>
                  </div>
                ))
              : null}
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
