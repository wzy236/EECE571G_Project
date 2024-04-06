import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="image">
          <img
            src="https://github.com/wzy236/EECE571G_Project/blob/main/frontend/src/images/trustfundhomepage1.png?raw=true"
            alt="Image 1"
            style={{ width: "100%", height: "100%" }}
          />
          <h3></h3>
        </div>
        <div className="image">
          <img
            src="https://github.com/wzy236/EECE571G_Project/blob/main/frontend/src/images/trustfundhomepage2.png?raw=true"
            alt="Image 2"
            style={{ width: "100%", height: "100%" }}
          />
          <h3></h3>
        </div>
        <div className="image">
          <img
            src="https://github.com/wzy236/EECE571G_Project/blob/main/frontend/src/images/trustfundhomepage3.png?raw=true"
            alt="Image 3"
            style={{ width: "100%", height: "100%" }}
          />
          <h3></h3>
        </div>
      </Slider>
    </div>
  );
}

export default SimpleSlider;
