import Test from "../components/Test";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Box,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import KeyboardIcon from "@material-ui/icons/Keyboard";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    height: "100vh",
  },
  half: {
    width: "50%",
  },
  boxHeight: {
    [theme.breakpoints.down("sm")]: {
      height: "350px",
    },
    [theme.breakpoints.up("sm")]: {
      height: "500px",
    },
  },
  marginBottom: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: "0.8rem",
    },
  },
}));

const borderInput = makeStyles(() => ({
  root: {
    "&:hover $notchedOutline": {
      borderColor: "#BCB6B6",
    },
    "&$focused $notchedOutline": {
      borderColor: "green",
    },
  },
  focused: {},
  notchedOutline: {},
}));

const TestPage = () => {
  const classes = useStyles();
  const changeBorderColor = borderInput();
  console.log("Test Page");
  return (
    <div>
      {/* <div className={classes.half}>
        <h1>Something here</h1>
      </div>
      <div className={classes.half} style={{ position: "relative" }}>
        <Test />
      </div> */}
      <Grid container>
        <Grid item xs={12}>
          <Box px={{ xs: 2, sm: 4, md: 4 }} py={{ xs: 1, sm: 2, md: 2 }}>
            <Typography variant="h5">
              Sync<span style={{ color: "#00d48b" }}>It</span>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box
            pl={{ xs: 3, sm: 7.5, md: 7.5 }}
            pr={{ xs: 6, sm: 9, md: 9 }}
            py={{ xs: 4, sm: 12, md: 12 }}
          >
            <Box>
              <Typography
                variant="h3"
                style={{ fontSize: "2.6rem", marginBottom: "2rem" }}
              >
                Premium video meetings.
                <br /> For upto four people.
              </Typography>
              <Typography
                variant="subtitle1"
                style={{ fontWeight: 500, color: "#666161" }}
              >
                Re-engineered the service for secure friendly meetings, SyncIt,
                to make free and available for all.
              </Typography>
            </Box>
            <Box py={{ xs: 3, sm: 7, md: 7 }}>
              <Button
                style={{
                  padding: "0.9rem 1rem",
                  textTransform: "capitalize",
                  background: "#0F9D58",
                  marginRight: "1rem",
                }}
                variant="contained"
                color="primary"
                startIcon={<MeetingRoomIcon />}
                className={classes.marginBottom}
              >
                Create Room
              </Button>
              <FormControl variant="outlined">
                <OutlinedInput
                  placeholder="Enter a code or link"
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      <KeyboardIcon />
                    </InputAdornment>
                  }
                  classes={changeBorderColor}
                />
              </FormControl>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box
            px={{ xs: 3, sm: 7.5, md: 7.5 }}
            py={{ xs: 2, sm: 4, md: 4 }}
            className={classes.boxHeight}
            style={{ borderRadius: "20px" }}
          >
            <Test />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box my={5}>
            <Typography variant="subtitle1" align="center">
              Sync<span style={{ color: "#00d48b" }}>It</span>
              &nbsp; &copy;&nbsp;Copyright {new Date().getUTCFullYear()}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
  //   return <TestComp heading={"Some heading"} color={"#222324"} />;
};

export default TestPage;
