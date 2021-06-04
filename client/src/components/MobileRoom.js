import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Drawer } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import LocalMoviesIcon from "@material-ui/icons/LocalMovies";
import CancelIcon from "@material-ui/icons/Cancel";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import TabPanel from "./TabPanel";
import clsx from "clsx";
import ChatIcon from "@material-ui/icons/Chat";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import LinkIcon from "@material-ui/icons/Link";
import CallEndIcon from "@material-ui/icons/CallEnd";
import Chat from "../components/Chat";
import VideoChat from "../components/VideoChat";
import VideoStream from "../components/VideoStream";

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
  speedDialAction: {
    boxShadow: "none",
    backgroundColor: theme.palette.secondary.dark,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: `-${drawerHeight}`,
    "& .content-box": {
      height: "90vh",
      transition: theme.transitions.create("height", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  contentShift: {
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginTop: 0,
    "& .content-box": {
      height: "60vh",
      transition: theme.transitions.create("height", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
}));

const copyLink = () => {
  console.log("copy link");
};

const endCall = () => {
  console.log("end call");
};

const actions = [
  {
    icon: <ChatIcon style={{ color: "#fff" }} />,
    name: "Chat",
    hasTab: true,
  },
  {
    icon: <VideoCallIcon style={{ color: "#fff" }} />,
    name: "Video Call",
    hasTab: true,
  },
  {
    icon: <LinkIcon style={{ color: "#fff" }} />,
    name: "Copy room link",
    hasTab: false,
    action: copyLink,
  },
  {
    icon: <CallEndIcon style={{ color: "red" }} />,
    name: "End Call",
    hasTab: false,
    action: endCall,
  },
];

const MobileRoom = ({ self, state, peers }) => {
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
                className={classes.speedDialAction}
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={
                  action.hasTab
                    ? (e) => tabClicked(e, index)
                    : () => action.action()
                }
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
      >
        <VideoStream self={self} />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openDrawer,
        })}
      >
        <TabPanel value={value} index={0}>
          <div className="content-box">
            <Chat self={self} />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className="content-box">
            <VideoChat self={self} state={state} peers={peers} />
          </div>
        </TabPanel>
      </main>
    </div>
  );
};

export default MobileRoom;
