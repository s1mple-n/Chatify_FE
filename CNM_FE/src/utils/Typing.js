import { makeStyles } from '@material-ui/core';
import React from 'react'
const useStyles = makeStyles((theme) => ({
    typing: {
        width: "3rem",
        height: ".5rem",
        position: "relative",
        padding: "5px",
        marginLeft: "5px",
        borderRadius: "20px",
        display: 'inline-block',
    },
    typing__dot: {
        float: "left",
        width: "8px",
        height: "8px",
        margin: "0 4px",
        background: "#005fff",
        borderRadius: "50%",
        opacity: 0,
        animation: `$loadingFade 1s infinite`,
        "&:nth-child(1)": {
            animationDelay: "0s",
        },
        "&:nth-child(2)": {
            animationDelay: "0.2s",
        },
        "&:nth-child(3)": {
            animationDelay: "0.4s",
        },
        },
    "@keyframes loadingFade": {
        "0%": {
          opacity: 0,
        },
        "50%": {
          opacity: 0.8,
        },
        "100%": {
          opacity: 0,
        }
      }
  }))
  
function Typing() {
  const classes = useStyles();
    return (
        <div className={classes.typing}>
            <div className={classes.typing__dot}></div>
            <div className={classes.typing__dot}></div>
            <div className={classes.typing__dot}></div>
        </div>
    )
}

export default Typing
