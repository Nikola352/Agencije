import React, { ReactNode, useRef } from "react";
import left_arrow from "../../assets/icons/left-arrow.svg";
import right_arrow from "../../assets/icons/right-arrow.svg";
import useRenderOnScreenSize from "../../hooks/useRenderOnScreenSize";

const Slider: React.FC<{children: ReactNode}> = ({children}: any) => {
    const slider = useRef<HTMLDivElement>(null);

    const slideLeft =()=>{
        slider.current!.scrollLeft = slider.current!.scrollLeft - 300
    }

    const slideRight =()=>{
        slider.current!.scrollLeft = slider.current!.scrollLeft + 300
    }

    const smScreen = useRenderOnScreenSize(640);

    return ( 
        <div id="slider" className="h-80 relative">
            {smScreen && 
                <button className="absolute left-2 top-[45%] z-[1] rounded-full bg-primary-500 opacity-70 hover:opacity-100 active:bg-primary-700" onClick={slideLeft}>
                    <img src={left_arrow} alt="left" />
                </button>
            }
            {smScreen && 
                <button className="absolute right-2 top-[45%] z-[1] rounded-full bg-primary-500 opacity-70 hover:opacity-100 active:bg-primary-700" onClick={slideRight}>
                    <img src={right_arrow} alt="right" />
                </button>
            }

            <div ref={slider} className="w-full overflow-scroll h-full p-3 border border-primary-300 shadow-xl bg-primary-300 shadow-primary-300 rounded-lg scroll-smooth">

                <div className="min-w-0 min-h-0 sm:w-fit flex flex-col sm:flex-row items-center justify-around gap-16 px-4">

                    {React.Children.map(children, (child: React.ReactElement) => (
                        <div className="w-72 h-72">
                            {child}
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}
 
export default Slider;