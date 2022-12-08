import { ImageList, ImageListItem, makeStyles } from "@material-ui/core";
import { AttachFile, Image } from "@material-ui/icons";
import React, { useState } from "react";
import Lightbox from "react-image-lightbox";
import { useSelector } from "react-redux";
// import "react-awesome-lightbox/build/style.css";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: "100%",
  },
  msg: {
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    backgroundColor: theme.palette.grey[100],
    padding: ".3rem 1rem",
    textAlign: "center",
    width: "100%",
    borderRadius: ".5rem",
  },
}));
function ListImage() {
  const { media } = useSelector((state) => state.currentConversation);
  const classes = useStyles();
  const [isShowFullImage, setIsShowFullImage] = useState(false);
  const [imageFull, setImageFull] = useState({
    image: "",
    title: "",
  });
  const handleViewFullImageLightBox = (image,index) => {
    setPhotoIndex(index)
    // setImageFull({ image, title: "Hình ảnh" });
    setIsShowFullImage(true);
  };

  const [photoIndex,setPhotoIndex] = useState();

  return (
    <div className={classes.root}>
      {isShowFullImage && (
        <Lightbox
          mainSrc={media[photoIndex].media.url}
          nextSrc={media[(photoIndex + 1) % media.length].media.url}
          prevSrc={media[(photoIndex + media.length - 1) % media.length].media.url}
          // mainSrc={imageFull.image}
          onCloseRequest={() => setIsShowFullImage(false)}
          onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + media.length - 1) % media.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % media.length)
          }
        />
      )}
      {media?.length === 0 || !media ? (
        <div className={classes.msg}>
          <Image style={{color:"#005fff"}}/> Chưa có ảnh/vieo nào được chia sẻ
        </div>
      ) : (
        <ImageList rowHeight={160} className={classes.imageList} cols={3}>
          {media?.map((item, index) =>
            item.media.type.match(/video/i) ? (
              <ImageListItem cols={1} key={index} className={classes.image}>
                <video controls src={item.media.url} alt="video" />
              </ImageListItem>
            ) : (
              <ImageListItem
                key={index}
                cols={1}
                onClick={() => handleViewFullImageLightBox(item.media.url,index)}
                className={classes.image}
              >
                <img src={item.media.url} alt="image1" />
              </ImageListItem>
            )
          )}
        </ImageList>
      )}
    </div>
  );
}

export default ListImage;
