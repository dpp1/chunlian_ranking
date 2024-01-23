"use client";

import React, { useRef, useEffect } from "react";
import './index.css';

// export interface CoupletProps {
//     coupletTop: string;
//     coupletLeft : string;
//     coupletRight : string;
// }

export default function CoupletFont(props) {

    console.log(props.coupletTop);
    console.log(props.coupletLeft);
    console.log(props.coupletRight);

    const canvasRef = useRef(null)
  
    useEffect(() => {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      // draw
      context.font = "40px xss";
      context.fillText(props.coupletTop, 50, 80);
    }, [])

    const canvasRef2 = useRef(null)

    useEffect(() => {
      const canvas = canvasRef2.current;
      canvas.height="1000";
      const context = canvas.getContext('2d')
      // draw
      context.font = "40px Georgia";
      context.fillText('飞', 50, 40);
      context.fillText('雪', 50, 110);
      context.fillText('迎', 50, 180);
      context.fillText('春', 50, 250);
      context.fillText('万', 50, 320);
      context.fillText('象', 50, 390);
      context.fillText('新', 50, 460);
    }, [])

    const canvasRef3 = useRef(null)
    
    useEffect(() => {
      const canvas = canvasRef3.current
      const context = canvas.getContext('2d')
      canvas.height="1000";
      // draw
      context.font = "40px Georgia";
      context.fillText('腾', 50, 40);
      context.fillText('云', 50, 110);
      context.fillText('追', 50, 180);
      context.fillText('月', 50, 250);
      context.fillText('千', 50, 320);
      context.fillText('钧', 50, 390);
      context.fillText('力', 50, 460);
    }, [])

    return (<div className="coupletPrinter">
        <div className="wrap">
            <div className="canvas-mode-2">
                <div className="row">
                    <canvas id="canvas-top"></canvas>
                </div>
                <div className="row">
                    <canvas id="canvas-left" ref={canvasRef2}></canvas>
                    <canvas id="canvas-right"></canvas>
                </div>
                <canvas id="dl-top" ref={canvasRef}></canvas>
                <canvas id="dl-left" ></canvas>
                <canvas id="dl-right" ref={canvasRef3}></canvas>
            </div>
        </div>
    </div>);
}