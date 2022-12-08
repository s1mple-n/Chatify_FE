import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor:"#5695ff",
  },
  profilePicture: {
    margin:"150px 0 20px 0",
    width: "5rem",
    height: "5rem",
  },
  callBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 400,
  },
  showVideo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  name:{
    position:"absolute",
    bottom: 10,
    left:10,
    color: "white",
    background:"#a19999" ,
    padding: "3px 10px",
    borderRadius:"5px",
  },
  video:{
    width:"100%",
  },
  otherVideo: {width: "100%",},
  other:{
    position:"relative",
  },
  youVideoWrap: {
    position: "absolute",
    right: 0,
    bottom: -4,
    width: "300px",
  },
}));
