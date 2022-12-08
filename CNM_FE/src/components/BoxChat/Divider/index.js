import React, { Component } from "react";
import "./style.css";

const Divider = ({ children }) => {
  return (
    <div className="container-divider">
      <div className="border-divider" />
      <span className="content-divider">{children}</span>
      <div className="border-divider" />
    </div>
  );
};

export default Divider;
