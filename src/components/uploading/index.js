import React from "react";
import ReactBodymovin from "react-bodymovin";
import animation from "./data.json";

const Uploading = () => {
  const bodymovinOptions = {
    loop: true,
    autoplay: true,
    prerender: true,
    animationData: animation
  };

  return (
    <div className="uploading">
      <ReactBodymovin options={bodymovinOptions} />
    </div>
  );
};

export default Uploading;
