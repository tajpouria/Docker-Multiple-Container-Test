import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import App from "./App";

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={App} />
            <Route
                path="/anotherpage"
                render={() => (
                    <div>
                        <Link to="/">HOME</Link>
                    </div>
                )}
            />
        </Switch>
    </Router>,
    document.getElementById("root")
);
