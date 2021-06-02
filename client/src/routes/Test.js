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
    height: "30vh",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "100%",
    height: "30vh",
    backgroundColor: theme.palette.secondary.light,
    position: "relative",
    top: theme.spacing(0),
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
  const [open, setOpen] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [value, setValue] = useState(0);

  const toggleDrawer = () => {
    setOpen(!open);
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
              style={{ position: "absolute", top: "0.2rem", right: "3rem" }}
            >
              {!open ? <LocalMoviesIcon /> : <CancelIcon />}
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
          open={open}
          anchor="top"
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        ></Drawer>
        <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </div>
    );
  }
};

export default TestPage;
