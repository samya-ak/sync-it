import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Drawer } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import LocalMoviesIcon from "@material-ui/icons/LocalMovies";
import CancelIcon from "@material-ui/icons/Cancel";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import TabPanel from "../components/TabPanel";
import clsx from "clsx";

const drawerHeight = "30vh";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: "100%",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "100%",
    height: drawerHeight,
    backgroundColor: theme.palette.secondary.light,
    position: "relative",
    top: 0,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  speedDial: {
    position: "absolute",
    top: 0,
    right: 0,
    "& > button": {
      boxShadow: "none",
    },
    "& > button:active": {
      boxShadow: "none",
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: `-${drawerHeight}`,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginTop: 0,
  },
}));

const actions = [
  { icon: <LocalMoviesIcon />, name: "Copy" },
  { icon: <LocalMoviesIcon />, name: "Save" },
  { icon: <LocalMoviesIcon />, name: "Print" },
];

const TestPage = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [value, setValue] = useState(0);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const tabClicked = (e, index) => {
    console.log("Index", index);
    setValue(index);
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const handleClose = () => {
    setOpenSpeedDial(false);
  };

  const handleOpen = () => {
    setOpenSpeedDial(true);
  };

  if (matches) {
    return <div>Big Screen</div>;
  } else {
    return (
      <div className={classes.root}>
        <AppBar position="relative" color="primary" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              SyncIt
            </Typography>

            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              style={{ position: "absolute", top: "0.2rem", right: "3.5rem" }}
            >
              {!openDrawer ? <LocalMoviesIcon /> : <CancelIcon />}
            </IconButton>

            <SpeedDial
              icon={<MoreIcon />}
              ariaLabel="SpeedDial"
              onClose={() => handleClose()}
              onOpen={() => handleOpen()}
              open={openSpeedDial}
              direction={"down"}
              className={classes.speedDial}
            >
              {actions.map((action, index) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={(e) => tabClicked(e, index)}
                />
              ))}
            </SpeedDial>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          open={openDrawer}
          anchor="top"
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        ></Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: openDrawer,
          })}
        >
          <TabPanel value={value} index={0}>
            Item One
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
        </main>
      </div>
    );
  }
};

export default TestPage;
