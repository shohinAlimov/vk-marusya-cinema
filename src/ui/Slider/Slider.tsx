import 'swiper/swiper-bundle.css';
import { Swiper } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { ReactNode } from 'react';
import "./Slider.scss";

interface SliderProps {
  children: ReactNode,
  autoPlay?: boolean,
  gap?: number,
  className?: string
}

const Slider = ({ children, autoPlay, gap = 40, className = 'slider__swiper' }: SliderProps) => {
  return (
    <Swiper
      className={`slider__swiper ${className}`}
      modules={[Autoplay]}
      spaceBetween={gap}
      slidesPerView={3.5}
      loop={true}
      autoplay={
        autoPlay
          ? {
            delay: 4000,
            disableOnInteraction: false,
          }
          : false
      }
      breakpoints={{
        200: {
          slidesPerView: 1.5
        },
        450: {
          slidesPerView: 2
        },
        520: {
          slidesPerView: 2.5
        },
        650: {
          slidesPerView: 3
        },
        750: {
          slidesPerView: 3.5
        },

      }
      }
    >
      {children}
    </Swiper>
  )
}

export default Slider;