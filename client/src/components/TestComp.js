import { makeStyles } from "@material-ui/core/styles";
import pic from "../images/1.png";

const useStyles = makeStyles(() => ({
  container: ({ color }) => ({
    display: "flex",
    height: "100%",
    backgroundColor: color,
  }),
  img: {
    width: "100%",
  },
  text: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  imgContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
}));

const TestComp = ({ heading, color }) => {
  console.log("Color: ", color);
  const classes = useStyles({ color });

  return (
    <div className={classes.container}>
      <div className={classes.text}>
        <div>
          <h1>{heading}</h1>
          <p>This is the paragraph.</p>
          <p>Another paragraph</p>
        </div>
      </div>
      <div className={classes.imgContainer}>
        <img className={classes.img} src={pic} alt="Pic" />
      </div>
    </div>
  );
};

export default TestComp;
