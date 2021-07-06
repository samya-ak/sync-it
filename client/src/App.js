import { Route, Switch, useLocation } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Room from "./routes/Room";
import Test from "./routes/Test";
import "./App.css";
import { Context } from "./components/Store";
import { useContext, useEffect } from "react";
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
  const location = useLocation();

  useEffect(() => {
    console.log("Location>>>>>", location);
    console.log("State>>>>", state);
    //leave room when route changes
    if (
      state.self &&
      state.room &&
      location &&
      !/^\/rooms\/\d+$/.test(location.pathname)
    ) {
      console.log("end call from app-------");
      let peers = state.room.peers;
      const self = state.room.peers.get(state.self);
      peers.forEach((peer) => peer.id === state.self || peer.closeConnection());
      if (self.socket) {
        if (state.sfuPeer && state.sfuPeer.isBroadcaster)
          self.socket.emit("stop streaming", self.room);
        self.socket.emit("leave room", self.room);
        dispatch({ type: "RESET" });
      }
    }
  }, [location]);

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
      <div>
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
    </ThemeProvider>
  );
}

export default App;
