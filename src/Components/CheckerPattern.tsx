import { render } from 'preact';
import { CSSProperties } from "preact/compat";
import { useEffect, useRef, useState } from 'preact/hooks';

export const CheckerPattern = (props: { style: CSSProperties, color_a: string, color_b: string }) => {
    const ref_Div = useRef<HTMLDivElement>()

    useEffect(() => {
        if (!ref_Div.current)
            return
        const d = ref_Div.current
        for (const key in props.style)
            d.style[key] = props.style[key]
        d.style.outlineOffset = "-1px"
        d.style.outlineStyle = "solid"
        d.style.outlineWidth = "1px"
        d.style.outlineColor = props.color_a;
        d.style.background = `repeating-conic-gradient(${props.color_a} 0% 25%, ${props.color_b} 0% 50%) 50% / 2rem 2rem`
    }, [ref_Div, props.style, props.color_a, props.color_b])

    return <div ref={ref_Div} className="checker-pattern" />
}