import "./TitleContainer.scss"
import { CSSProperties } from "preact/compat"
import { ComponentChildren } from "preact"

export const TitleContainer = (props: {
    title: string,
    className?: string,
    style?: CSSProperties,
    children?: ComponentChildren
}) => {
    return <div style={props.style ?? {}} className={`cfxs-title-container ${props.className ?? ""}`}>
        <span className="title">{props.title}</span>
        {props.children ?? <></>}
    </div>
}