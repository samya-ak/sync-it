import { makeStyles } from "@material-ui/core/styles";
import pic from "../images/1.png";

const useStyles = makeStyles(() => ({
  container: ({ color }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: color,
    borderRadius: "0 40px 145px 0",
  }),
  img: {
    width: "100%",
  },
  text: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "30%",
  },
  imgContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70%",
  },
}));

const TestComp = ({ heading, color }) => {
  const classes = useStyles({ color });

  return (
    <div className={classes.container}>
      <div className={classes.imgContainer}>
        <img className={classes.img} src={pic} alt="Pic" />
      </div>
      <div className={classes.text}>
        <div>
          <h1>{heading}</h1>
          <p>This is the paragraph.</p>
          <p>Another paragraph</p>
        </div>
      </div>
    </div>
  );
};

export default TestComp;
