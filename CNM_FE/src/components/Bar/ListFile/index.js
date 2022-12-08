import { Grid, makeStyles } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import { useSelector } from "react-redux";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
  file: {
    backgroundColor: theme.palette.grey[100],
    padding: "0.5rem",
    borderRadius: ".5rem",
    textDecoration: "none",
    display:"flex",
    alignItems:"center",
  },
  msg: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.grey[100],
    padding: ".3rem 1rem",
    textAlign: "center",
    width: "100%",
    borderRadius: ".5rem",
  },
}));

function ListFile() {
  const { file } = useSelector((state) => state.currentConversation);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {file?.length === 0 || !file ? (
        <div className={classes.msg}>
          <AttachFile style={{ color: "#005fff" }} /> Chưa có tệp nào được chia
          sẻ
        </div>
      ) : (
        <Grid container spacing={2} direction="column">
          {file?.map((item) => (
            <Grid item style={{ borderRadius: ".5rem",}}>
              <a
                className={classes.file}
                href={`https://docs.google.com/gview?embedded=true&url=${item.media.url}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <AttachFile style={{ color: "#005fff" }} /> {item.text}
              </a>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default ListFile;
