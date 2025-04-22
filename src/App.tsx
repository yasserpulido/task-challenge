import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import { TaskForm, TaskList } from "./components";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={TaskList} />
          <Route path="/edit/:id" component={TaskForm} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
