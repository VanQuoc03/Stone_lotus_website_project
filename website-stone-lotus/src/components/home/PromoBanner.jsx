import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const banners = [
  {
    src: "https://theme.hstatic.net/1000187613/1001083990/14/slide_1_img.jpg?v=223",
    alt: "Giao hàng toàn quốc",
  },
  {
    src: "https://theme.hstatic.net/1000187613/1001083990/14/slide_2_img.jpg?v=223",
    alt: "Hoàn tiên 100% sản phẩm hư vỡ",
  },
];

export default function PromoBanner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  return (
    <div className="w-full max-h-[800px] overflow-hidden">
      <Slider {...settings}>
        {banners.map((item, idx) => (
          <div key={idx}>
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-[800px] object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
