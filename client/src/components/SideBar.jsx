import React, { useState, useEffect } from "react";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SegmentIcon from "@mui/icons-material/Segment";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import Badge from '@mui/material/Badge';
import "../components/styles/SideBar.css";

function SideBar({ logoutUser, setProfile, user, setUser }) {
  const [state, setState] = React.useState({
    left: false,
  });

  const navigate = useNavigate();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="slide-top">Ambitious Forgetfuls</div>
      <List>
        {["Search", "My Tasks", "Create Task", "Task Invites"].map(
          (text, index) => (
            <Link
              onClick={index === 1 ? () => setProfile(user) : null}
              style={{ textDecoration: "none", color: "white" }}
              to={
                index === 0
                  ? "/search"
                  : index === 1
                  ? "/profile"
                  : index === 2
                  ? "/createTask"
                  : index === 3
                  ? "/taskRequest"
                  : null
              }
            >
              <ListItem button key={text}>
                <ListItemIcon>
                  {index === 0 ? (
                    <SearchIcon />
                  ) : index === 1 ? (
                    <AssignmentIcon onClick={() => setProfile(user)} />
                  ) : index === 2 ? (
                    <PlaylistAddIcon />
                  ) : index === 3 ? (
                    <Badge badgeContent={!user.pendingRequest ? null : user.pendingRequest.length} color="primary">
                      <NotificationsActiveIcon />
                    </Badge>
                  ) : null}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
          )
        )}
      </List>
      <MeetingRoomIcon
        onClick={() => logoutUser()}
        className="log-out"
        fontSize="large"
      />
    </Box>
  );

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem("token")));
    setProfile(jwtDecode(localStorage.getItem("token")));
  }, []);

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <SegmentIcon
            style={{ cursor: "pointer", color: "#2699FB" }}
            fontSize="large"
            onClick={toggleDrawer(anchor, true)}
          >
            {anchor}
          </SegmentIcon>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default SideBar;
