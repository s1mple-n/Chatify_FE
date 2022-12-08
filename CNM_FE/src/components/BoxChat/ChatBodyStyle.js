import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  wrapperDrawerOpen: {
    borderLeft: "1px solid #E1E1E1",
    width: "65.5%",
  },
  wrapperDrawerClose: {
    borderLeft: "1px solid #E1E1E1",
    width: "100%",
  },
  chatBody: {
    flex: "1",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column-reverse",
    padding: "0 1rem",
    backgroundColor: "white",
  },
  displayTop: {
    flexDirection: "column",
  },
  card: {
    minWidth: "70%",
    margin: "0 auto",
    textAlign: "center",
    marginTop: "1rem",
  },
  media: {
    height: 200,
  },
}));
