import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  chatMessage: {
    display: "flex",
    marginBottom: "4px",
  },
  chatMessageRight: {
    justifyContent: "flex-end",
  },
  avatarHidden: {
    display: "none",
  },
  wrapper: {
    marginLeft: ".5rem",
    display: "flex",
    flexDirection: "column",
    justifyItems: "flex-start",
    alignItems: "start",
    width: "auto",
    maxWidth: "50%",
    display:"block",
  },
  wrapperEnd: {
    alignItems: "end",
    textAlign: "end",
    
  },
  hideAvt:{
    display:"none",
  },
  textWrapper: {
    // backgroundColor: theme.palette.grey[300],
    backgroundColor: "#E1E1E1",
    padding: "0.5rem 1rem 0.2rem 1rem",
    borderRadius: ".5rem",
    position: "relative",
    width: "auto",
    wordWrap:"break-word",
  },
  textWrapperColor: {
    // background: `linear-gradient(to left bottom, ${theme.palette.secondary.main}, ${theme.palette.secondary.main})`,
    backgroundColor: "#0978f5",
  },
  textContent: {
    // backgroundColor:"red",
    fontSize: "18px",
    color: "black",
    fontFamily: "ROBOTO",
    marginBottom: "10px",
  },
  nameSmall:{
    fontSize:12,
  },
  flexFirstRight: {
    color: "white",
  },
  times: {
    color: "#757575",
  },
  timesRight: {
    color: "#F5F5F5",
  },
  emojiWrapper: {
    position: "absolute",
    bottom: "-10%",
    right: "10px",

    display: "flex",
    alignItems: "center",
  },
  likeCount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "white",
    padding: "1px 8px",
    borderRadius: "5rem",
    border: `1px solid ${theme.palette.grey[300]}`,
    marginRight: ".2rem",
    width: "1.2rem",
    height: "1.2rem",
  },
  emoji: {
    color: theme.palette.grey[500],
    backgroundColor: "white",
    borderRadius: "50%",
    border: `1px solid ${theme.palette.grey[300]}`,
    width: "1.2rem",
    height: "1.2rem",
    transition: "all .2s ease",
    "&:hover": {
      color: theme.palette.primary.light,
      cursor: "pointer",
    },
  },
  media: {
    display: "flex",
    flexDirection: "row",
    // marginTop: "1rem",
  },
  mediaRight: {
    alignItems: "center",
    flexDirection: "row-reverse",
    // width: "150px",
  },
  imageWrapper: {
    transition: "all .2s ease",
    position: "relative",
    "&:hover": {
      cursor: "pointer",
      opacity: "0.8",
    },
  },
  call: {
    padding: "10px 20px",
    backgroundColor: theme.palette.grey[200],
    borderRadius: ".5rem",
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: ".5rem",
      color: theme.palette.error.dark,
    },
  },
  video: {
    width: "350px",
  },
  action: {
    display: "flex",
    alignItems: "center",
  },
}));
