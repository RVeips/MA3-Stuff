import { render } from 'preact';
import { useState } from 'preact/hooks';
import { signal } from '@preact/signals';
import './Assets/Styles/Main.scss';
import "./AppLayout.scss"
import { ColorEdit } from './Components/ColorEdit';
import { DrawSurface } from './Components/DrawSurface';
import { CheckerPattern } from './Components/CheckerPattern';
import { TitleContainer } from './Components/TitleContainer';

const custom_color_outline = signal("#07F")
const custom_color_background = signal("#333")
const custom_color_text = signal("#FFF")

function draw(ctx: CanvasRenderingContext2D, data: any) {
	const W = ctx.canvas.width
	const H = ctx.canvas.height
	const Q = window.devicePixelRatio

	ctx.fillStyle = data.color
	ctx.fillRect(0, 0, 64, 64)
}

const App = () => {
	const [drawTrigger_Custom, setDrawTrigger] = useState(new Date)
	const [imageDim, setImageDim] = useState({ width: 128, height: 128 })

	return (
		<div className="app-layout">
			<TitleContainer style={{ width: "100%", height: "100%" }} title="Color Buttons">
			</TitleContainer>
			<TitleContainer style={{ width: "100%", height: "100%" }} title="Custom Buttons">
				<div style={{ height: "100%", paddingLeft: "1rem", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
					<ColorEdit title="Background" initialColor={custom_color_background.value} colorChanged={(c: string) => { custom_color_background.value = c, setDrawTrigger(new Date) }} />
					<ColorEdit title="Outline" initialColor={custom_color_outline.value} colorChanged={(c: string) => { custom_color_outline.value = c, setDrawTrigger(new Date) }} />
					<ColorEdit title="Text" initialColor={custom_color_text.value} colorChanged={(c: string) => { custom_color_text.value = c, setDrawTrigger(new Date) }} />
					<CheckerPattern color_a={"#111111"} color_b={"#141414"}
						style={{
							width: "16rem",
							height: "16rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							marginLeft: "1rem",
							borderStyle: "solid",
							borderWidth: "2px",
							borderColor: "#555",
							boxSizing: "border-box"
						}}>
						<DrawSurface drawTrigger={drawTrigger_Custom} drawFunction={draw} data={{
							color_background: custom_color_background.value,
							color_outline: custom_color_outline.value,
							color_text: custom_color_text.value
						}}
							style={{
								width: "80%",
								height: "80%",
							}}
							width={imageDim.width} height={imageDim.height} />
					</CheckerPattern>
				</div>
			</TitleContainer>
		</div>
	)
}

render(<App />, document.getElementById('app'));
