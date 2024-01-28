import "./DrawSurface.scss"
import { render } from 'preact';
import { CSSProperties } from "preact/compat";
import { useEffect, useRef, useState } from 'preact/hooks';

export const DrawSurface = (props: {
    drawTrigger: any,
    drawFunction: Function,
    data: any,
    width: number,
    height: number,
    style?: CSSProperties
}) => {
    const ref_Canvas = useRef<HTMLCanvasElement>()

    useEffect(() => {
        if (!ref_Canvas.current)
            return
        const ctx = ref_Canvas.current.getContext("2d")
        props.drawFunction(ctx, props.data)
    }, [ref_Canvas, props.drawFunction, props.drawTrigger, props.width, props.height])

    return <canvas style={props.style ?? {}} ref={ref_Canvas} className="draw-surface" width={props.width} height={props.height} />
}