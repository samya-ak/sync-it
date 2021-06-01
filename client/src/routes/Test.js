import Test from "../components/Test";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import KeyboardIcon from "@material-ui/icons/Keyboard";

// import TestComp from "../components/TestComp";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    height: "100vh",
  },
  half: {
    width: "50%",
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
          <Box px={4} py={2}>
            <Typography variant="h5">
              Sync<span style={{ color: "#00d48b" }}>It</span>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box pl={7.5} pr={9} py={12}>
            <Box pr>
              <Typography
                variant="h3"
                style={{ fontSize: "2.6rem", marginBottom: "2rem" }}
              >
                Premium video meetings.
                <br /> For upto four people.
              </Typography>
              <Typography variant="subtitle1">
                Re-engineered the service for secure friendly meetings, SyncIt,
                to make free and available for all.
              </Typography>
            </Box>
            <Box py={6}>
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
          <Box px={7.5} py={4} height="500px" style={{ borderRadius: "20px" }}>
            <Test />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box my={7}>
            <Typography variant="subtitle1" align="center">
              Sync<span style={{ color: "#00d48b" }}>It</span> Copyright 2021
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
  //   return <TestComp heading={"Some heading"} color={"#222324"} />;
};

export default TestPage;
