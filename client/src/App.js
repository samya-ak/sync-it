import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Room from "./routes/Room";
import Test from "./routes/Test";
import "./App.css";
import { Context } from "./components/Store";
import { useContext } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const theme = createMuiTheme({
  palette: {
    paper: "#EAECEE",
    primary: {
      light: "#33ab9f",
      main: "#009688",
      dark: "#00695f",
      contrastText: "#fff",
    },
    secondary: {
      light: "#74c59f",
      main: "#52b788",
      dark: "#39805f",
      contrastText: "#000",
    },
  },
});

function App() {
  const [state, dispatch] = useContext(Context);
  console.log("app", state);

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch({
      type: "SHOW_SNACKBAR",
      payload: { open: false, message: null, severity: null },
    });
  };

  return (
    <ThemeProvider theme={theme}>
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
          {state.snackbar.open && (
            <Snackbar
              open={state.snackbar.open}
              autoHideDuration={3000}
              onClose={handleClose}
            >
              <Alert severity={state.snackbar.severity} onClose={handleClose}>
                {state.snackbar.message}
              </Alert>
            </Snackbar>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
