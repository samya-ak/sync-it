import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  container: ({ backgroundColor }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: backgroundColor,
    borderRadius: "0 40px 145px 0",
  }),
  img: {
    width: "100%",
  },
  text: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "25%",
  },
  imgContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "75%",
  },
}));

const Slide = ({ data }) => {
  const { title, backgroundColor, description, image } = data;
  const classes = useStyles({ backgroundColor });

  return (
    <div className={classes.container}>
      <div className={classes.imgContainer}>
        <img className={classes.img} src={image} alt="Pic" />
      </div>
      <div className={classes.text}>
        <div>
          <p
            style={{
              color: "#fff",
              fontSize: "1.3rem",
              textDecoration: "underline",
            }}
          >
            {title}
          </p>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Slide;
