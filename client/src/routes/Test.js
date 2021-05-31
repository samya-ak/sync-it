import Test from "../components/Test";
import { makeStyles } from "@material-ui/core/styles";
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

const TestPage = () => {
  const classes = useStyles();
  console.log("Test Page");
  return (
    <div className={classes.container}>
      <div className={classes.half}>
        <h1>Something here</h1>
      </div>
      <div className={classes.half} style={{ position: "relative" }}>
        <Test />
      </div>
    </div>
  );
  //   return <TestComp heading={"Some heading"} color={"#222324"} />;
};

export default TestPage;
