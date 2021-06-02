import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Room from "./routes/Room";
import Test from "./routes/Test";
import "./App.css";
import { Context } from "./components/Store";
import Error from "./components/Error";
import { useContext } from "react";

function App() {
  const [state] = useContext(Context);
  console.log("app", state);
  return (
    <Router>
      <div className="">
        <Switch>
          <Route exact path="/">
            <div>
              <Home />
            </div>
          </Route>
          <Route exact path="/test">
            <Test />
          </Route>
          <Route exact path="/rooms/:id">
            <Room />
          </Route>
          <Route exact path="*">
            <NotFound />
          </Route>
        </Switch>
        {state.error && <Error />}
      </div>
    </Router>
  );
}

export default App;
