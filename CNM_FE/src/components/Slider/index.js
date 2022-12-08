import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";

function Item({ item }) {
  return (
    <div style={{ marginTop:"50px"}}>
      <img style={{ width: "100%", height: "650px" }} src={item.src}></img>
    </div>
  );
}
function Slider() {
  var items = [
    {
      src: require("../../assets/slide_img1.png"),
    },
    {
      src: require("../../assets/slide_img2.png"),
    },
    {
      src: require("../../assets/slide_img2.jpg"),
    },
    {
      src: require("../../assets/slide_img3.png"),
    },
  ];
  return (
    <Carousel animation="slide" duration={2000}>
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}
export default Slider;
