"use client";

import React, { useRef, useEffect } from "react";

export const CoupletWidget = React.forwardRef((props, ref) => {

    const canvasTop = useRef(null)
    const canvasLeft = useRef(null)
    const canvasRight = useRef(null)

    useEffect(() => {
        renderCoupletTop(props.coupletTop)
        renderCoupletDL(props.coupletLeft, canvasLeft.current);
        renderCoupletDL(props.coupletRight, canvasRight.current);
    }, [props]);

    const renderCoupletTop = async (coupletTop) => {
        const canvas = canvasTop.current
        const context = canvas.getContext('2d')
        canvas.width="400";
        // draw
        context.font = "70px " + props.font;
        await document.fonts.load(context.font);
        const indexStart = 65;
        const marge = 210 / (coupletTop.length - 1);
        for (let i = 0; i < coupletTop.length; i++) {
            context.fillText(coupletTop[i], indexStart + marge * i, 80);
        };
    }

    const renderCoupletDL = async (coupletDL, canvas) => {
        const context = canvas.getContext('2d')
        canvas.height="640";
        // draw
        context.font = "70px " + props.font;
        await document.fonts.load(context.font);
        const indexStart = 50;
        const marge = 70 * 9 / coupletDL.length;
        for (let i = 0; i < coupletDL.length; i++) {
            context.fillText(coupletDL[i], 50, indexStart + marge * i);
        };
    }


    return (<div className={props.background} ref={ref} id="coupletPhoto">
        <div className="wrap" >
            <div className="canvas-mode-2">
                <div className="row">
                    <div id="canvas-top">
                        <canvas className="dl-top" ref={canvasTop}></canvas>
                    </div>
                </div>
                <div className="row">
                    <div id="canvas-left" style={{height: (10 + 9 * 70) }}>
                        <canvas className="dl-left-right" ref={canvasLeft}></canvas>
                    </div>
                    <div id="canvas-right" style={{height: (10 + 9 * 70)}}>
                        <canvas className="dl-left-right" ref={canvasRight}></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>);
});
