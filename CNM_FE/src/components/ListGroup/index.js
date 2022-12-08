import React from "react";
import { Grid, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import "./styles.css";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import SearchComponent from "../Search";
import Paper from "@material-ui/core/Paper";
import PeopleAltTwoToneIcon from "@material-ui/icons/PeopleAltTwoTone";
import {
  styled,
  IconButton,
  Box,
  AppBar,
  Toolbar,
  InputBase,
  alpha,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { stringAvatar } from "../../utils/LetterAvatar";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Groups = ({ group }) => {
  return (
    <>
      <div
        className="friend-request"
        style={{ height: 200, width: 200, justifyContent: "center" }}
      >
        <div className="friend-request__main">
          <div className="friend-request__main-content">
            <AvatarGroup max={4}>
              {group.member.map((member) => (
                <Avatar
                  key={member?._id}
                  src={member?.avatarURL}
                  alt="avatar"
                  {...stringAvatar(member?.username)}
                />
              ))}
            </AvatarGroup>
            <Typography
              style={{ marginLeft: "30%", marginTop: 20 }}
              variant="subtitle1"
              gutterBottom
            >
              {group.label}
            </Typography>
            <Typography
              style={{ marginLeft: "20%", marginTop: 20 }}
              variant="subtitle1"
              gutterBottom
            >
              {group.member.length} Thành viên
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

const ListGroup = ({ listFriendsRequest }) => {
  const { conversations } = useSelector((state) => state.conversations);
  const { user } = useSelector((state) => state.auth);
  const groupsFilter = conversations.filter((conv) => conv.isGroup === true);
  const classes = useStyles();
  const [title, setTitle] = React.useState("");
  console.log(conversations);
  const handleChange = (event) => {
    setTitle(event.target.value);
  };
  return (
    <>
      <div
        className="list-friends-request"
        style={{
          width: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            position="static"
            style={{
              backgroundColor: "#0978f5",
              boxShadow: "none",
              borderLeft: "1px solid #E1E1E1",
              height: "60px",
            }}
          >
            <Toolbar>
              <PeopleAltTwoToneIcon
                style={{ fontSize: 30 }}
              ></PeopleAltTwoToneIcon>
              <Typography style={{ marginLeft: 30, fontSize: 20 }}>
                Danh sách nhóm
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <FormControl className={classes.formControl}>
            <NativeSelect
              value={title}
              onChange={handleChange}
              name="age"
              className={classes.selectEmpty}
              inputProps={{ "aria-label": "age" }}
            >
              <option value={10}> Tất cả ({groupsFilter.length})</option>
              <option value={20}>
                Tôi quản lý(
                {
                  groupsFilter.filter((conv) => conv.createdBy._id === user._id)
                    .length
                }
                )
              </option>
            </NativeSelect>
          </FormControl>
        </div>
        <Paper
          style={{
            maxHeight: "660px",
            overflow: "auto",
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            boxShadow: "none",
          }}
        >
          {groupsFilter.length > 0 &&
            groupsFilter.map((group) => (
              <>
                <Groups group={group} key={group._id} />
              </>
            ))}
        </Paper>
      </div>
    </>
  );
};

export default ListGroup;
