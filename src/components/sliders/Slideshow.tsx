import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import left_arrow from "../../assets/icons/left-arrow.svg";
import right_arrow from "../../assets/icons/right-arrow.svg";

type SlideshowProps = {
    slides: string[], // image urls
    autoPlayInterval: number, // in seconds
    width: number, // in px
    height?: string | number, // any valid css value
    duration?: number // in seconds
}

const Slideshow = ({slides, width, height='80vh', autoPlayInterval, duration=0.45}: SlideshowProps) => {
    const firstSlide = slides[0]
    const secondSlide = slides[1]
    const lastSlide = slides[slides.length - 1]

    const [state, setState] = useState({
        activeSlide: 0,
        translate: width,
        transition: duration,
        transitioning: false,
        _slides: [lastSlide, firstSlide, secondSlide]
    })

    const { activeSlide, translate, _slides, transition, transitioning } = state

    const autoPlayRef = useRef<(()=>void)|null>(null)
    const transitionRef = useRef<(()=>void)|null>(null)

    useEffect(() => {
        autoPlayRef.current = nextSlide
        transitionRef.current = smoothTransition
    });

    useEffect(() => {
        const play = () => {
            autoPlayRef.current!();
        }

        let interval: NodeJS.Timer|null = null

        if (autoPlayInterval) {
            interval = setInterval(play, autoPlayInterval * 1000);
        }

        return () => {
            if (autoPlayInterval && interval) {
                clearInterval(interval);
            }
        };
    }, [activeSlide])

    useEffect(() => {
        if (transition === 0) setState({ ...state, transition: duration, transitioning: false })
    }, [transition])

    useEffect(() => {
        setState({ ...state, translate: width, transition: duration })
    }, [width]);

    const nextSlide = () => {
        if(transitioning) return

        setState({
            ...state,
            translate: translate + width,
            activeSlide: activeSlide === slides.length - 1 ? 0 : activeSlide + 1
        })
    }

    const prevSlide = () => {
        if(transitioning) return

        setState({
            ...state,
            translate: 0,
            activeSlide: activeSlide === 0 ? slides.length - 1 : activeSlide - 1
        })
    }

    const smoothTransition = () => {
        let _slides = []

        // We're at the last slide.
        if (activeSlide === slides.length - 1)
            _slides = [slides[slides.length - 2], lastSlide, firstSlide]
        // We're back at the first slide. Just reset to how it was on initial render
        else if (activeSlide === 0) _slides = [lastSlide, firstSlide, secondSlide]
        // Create an array of the previous last slide, and the next two slides that follow it.
        else _slides = slides.slice(activeSlide - 1, activeSlide + 2)

        setState({
            ...state,
            _slides,
            transition: 0,
            translate: width
        })
    }
    
    return (
        <div className="card m-2 w-full" style={{width: width, height: height}}>
            <motion.div
                initial={{ translateX: 0 }}
                animate={{ translateX: -translate }}
                transition={{ duration: transition, type: 'tween' }}
                onAnimationComplete={smoothTransition}
                className="h-full min-w-0 min-h-0"
                style={{width: width * _slides.length}}
                >
                {_slides.map((_slide, i) => (
                    <div key={i} className="h-full inline-block" style={{width: width}}>
                        <img src={_slide} alt={_slide} className="h-full w-full object-cover"/>
                    </div>
                ))}
            </motion.div>
    
            <button onClick={prevSlide} className="absolute left-2 top-[45%] z-10 rounded-full bg-primary-500 opacity-70 hover:opacity-100 active:bg-primary-700">
                <img src={left_arrow} alt="left" className='w-full h-full' />
            </button>
    
            <button onClick={nextSlide} className="absolute right-2 top-[45%] z-10 rounded-full bg-primary-500 opacity-70 hover:opacity-100 active:bg-primary-700">
                <img src={right_arrow} alt="right" />
            </button>
    
            <div className="absolute bottom-3 w-full flex items-center justify-center">
            {slides.map((slide, i) => (
                <span 
                    key={i} 
                    className={`p-2 mr-1 rounded-full 
                    ${activeSlide === i ? 'bg-primary-500' : 'bg-secondary-400'}`}
                ></span>
            ))}
        </div>
        </div>
    )
}

export default Slideshow;