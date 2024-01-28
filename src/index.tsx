import { render } from 'preact';
import { useState } from 'preact/hooks';
import { signal } from '@preact/signals';
import './Assets/Styles/Main.scss';
import { ColorEdit } from './Components/ColorEdit';
import { DrawSurface } from './Components/DrawSurface';
import { CheckerPattern } from './Components/CheckerPattern';

const outline_color = signal("#0FF")

function draw(ctx: CanvasRenderingContext2D, data: any) {
	const W = ctx.canvas.width
	const H = ctx.canvas.height
	const Q = window.devicePixelRatio

	ctx.fillStyle = data.color
	ctx.fillRect(0, 0, 64, 64)
}

const App = () => {
	const [drawTrigger, setDrawTrigger] = useState(new Date)
	const [imageDim, setImageDim] = useState({ width: 128, height: 128 })

	return (
		<div>
			<ColorEdit title="Outline Color" initialColor={outline_color.value} colorChanged={(c: string) => { outline_color.value = c, setDrawTrigger(new Date) }} />
			<DrawSurface drawTrigger={drawTrigger} drawFunction={draw} data={{ color: outline_color.value }} width={imageDim.width} height={imageDim.height} />
			<CheckerPattern color_a={outline_color.value} color_b={"#161616"} style={{ width: "32rem", height: "16rem" }} />
		</div>
	)
}

render(<App />, document.getElementById('app'));
