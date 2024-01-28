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
const custom_rounded = signal(true)
const custom_very_rounded = signal(false)
const custom_circle = signal(false)
const custom_outline_bottom_only = signal(false)
const custom_outline_thick = signal(false)
const custom_text = signal("Strobe")
const custom_text_size = signal(16)
const custom_text_y_offset = signal(0)
const custom_unit_width = signal(1)
const custom_text_bold = signal(false)

const custom_resolution = signal(2)
const base_width = signal(64 * 2)
const base_height = signal(64 * 2)

function draw(ctx: CanvasRenderingContext2D, data: any) {
	const W = ctx.canvas.width
	const H = ctx.canvas.height
	const Q = window.devicePixelRatio

	const {
		color_background,
		color_outline,
		color_text,
		font_size,
		text,
		bottom_outline,
		rounded,
		very_rounded,
		circle,
		thicc,
		text_y_offset,
		unit_width,
		bold,
	} = data

	const MIN_DIM = (W > H ? H : W)
	const LINE_WIDTH = MIN_DIM / (thicc ? 12 : 32)
	const MARGIN = LINE_WIDTH / 2 + 1
	const X0 = 0 + MARGIN
	const Y0 = 0 + MARGIN
	const W0 = W - MARGIN * 2
	const H0 = H - MARGIN * 2

	ctx.clearRect(0, 0, W, H)

	const FONT_SIZE = MIN_DIM * (font_size / 100)
	ctx.font = (bold ? "bold " : "") + FONT_SIZE + "px Lato"

	ctx.save()

	ctx.fillStyle = color_background
	ctx.strokeStyle = color_outline
	ctx.lineWidth = LINE_WIDTH
	ctx.beginPath()
	if (rounded) {
		ctx.roundRect(X0, Y0, W0, H0, MIN_DIM / 8)
	} else if (very_rounded) {
		ctx.roundRect(X0, Y0, W0, H0, MIN_DIM / 4)
	} else if (circle) {
		ctx.roundRect(X0, Y0, W0, H0, MIN_DIM / 2)
	} else {
		ctx.rect(X0, Y0, W0, H0)
	}
	ctx.fill()

	if (bottom_outline) {
		ctx.beginPath()
		ctx.rect(0, H - LINE_WIDTH - 1, W, H)
		ctx.clip()
	}

	ctx.beginPath()
	if (rounded) {
		ctx.roundRect(X0, Y0, W0, H0, MIN_DIM / 8)
	} else if (very_rounded) {
		ctx.roundRect(X0, Y0, W0, H0, MIN_DIM / 4)
	} else if (circle) {
		ctx.roundRect(X0, Y0, W0, H0, MIN_DIM / 2)
	} else {
		ctx.rect(X0, Y0, W0, H0)
	}
	ctx.stroke()

	ctx.textAlign = "center"
	ctx.textBaseline = 'middle'
	ctx.fillStyle = color_text

	switch (text) {
		case "<circle>": {
			ctx.strokeStyle = color_text
			ctx.beginPath()
			ctx.lineWidth = MIN_DIM / 12
			ctx.arc(W / 2, H / 2, MIN_DIM / 4, 0, 2 * Math.PI)
			ctx.closePath()
			ctx.stroke()
			break
		}
		case "<triangle>": {
			ctx.strokeStyle = color_text
			ctx.beginPath()
			ctx.lineWidth = MIN_DIM / 16
			// draw triangle wave, up down up
			ctx.lineCap = "square";
			const QS = 1.5
			ctx.moveTo((- MIN_DIM / (QS * 8)) + W / 2 - MIN_DIM / (QS * 4), H / 2 + MIN_DIM / (QS * 4))
			ctx.lineTo((- MIN_DIM / (QS * 8)) + W / 2, H / 2 - MIN_DIM / (QS * 4))
			ctx.lineTo((- MIN_DIM / (QS * 8)) + W / 2 + MIN_DIM / (QS * 4), H / 2 + MIN_DIM / (QS * 4))
			ctx.lineTo((- MIN_DIM / (QS * 8)) + W / 2 + MIN_DIM / (QS * 4) + MIN_DIM / (QS * 4), H / 2 - MIN_DIM / (QS * 4))

			ctx.stroke()
			break
		}
		case "<sine>": {
			ctx.strokeStyle = color_text
			ctx.beginPath()
			ctx.lineWidth = MIN_DIM / 16
			ctx.lineCap = "round";
			// draw one period of sine wave (centered)
			const QS = 2
			const PERIOD = MIN_DIM / QS
			const AMP = MIN_DIM / 8
			const SMOOTHNESS = 1
			const NUM_POINTS = 90
			const GAP = PERIOD / NUM_POINTS
			const XOFF = -W / 4
			// go back one period so the wave looks continuous
			ctx.moveTo(XOFF + W / 2, H / 2)
			for (let i = 0; i < NUM_POINTS * SMOOTHNESS; i++) {
				const R = -AMP * Math.sin(i / NUM_POINTS * 2 * Math.PI)
				ctx.lineTo(XOFF + PERIOD / (NUM_POINTS * SMOOTHNESS) * i + W / 2, R + H / 2)
			}

			ctx.stroke()
			break
		}
		case "<square>": {
			ctx.strokeStyle = color_text
			ctx.beginPath()
			ctx.lineWidth = MIN_DIM / 16
			ctx.lineCap = "round";
			// draw one period of sine wave (centered)

			const CX = W / 2
			const CY = H / 2
			const DIMX = CX / 2
			const DIMY = CY / 4
			ctx.moveTo(CX + DIMX, CY - DIMY)
			ctx.lineTo(CX + DIMX, CY + DIMY)
			ctx.lineTo(CX, CY + DIMY)
			ctx.lineTo(CX, CY - DIMY)
			ctx.lineTo(CX - DIMX, CY - DIMY)
			ctx.lineTo(CX - DIMX, CY + DIMY)

			ctx.stroke()
			break
		}
		default: {
			const split = text.split("\\")

			const offset = (split.length - 1) / 2 * FONT_SIZE
			for (let i = 0; i < split.length; i++) {
				ctx.fillText(split[i], W / 2, H / 2 + text_y_offset - offset + FONT_SIZE * i)
			}
		}
	}
	ctx.restore()
}

const App = () => {
	const [drawTrigger_Custom, setDrawTrigger] = useState(new Date)
	const [imageDim, setImageDim] = useState({ width: base_width.value, height: base_height.value })

	const get_w = () => {
		if (imageDim.width > imageDim.height) {
			return "80%"
		} else {
			return `${80 / imageDim.height * imageDim.width}%`
		}
	}
	const get_h = () => {
		if (imageDim.height > imageDim.width) {
			return "80%"
		} else {
			return `${80 / imageDim.width * imageDim.height}%`
		}
	}

	return (
		<div className="app-layout">
			<TitleContainer style={{ width: "100%", height: "100%" }} title="Custom Buttons">
				<div style={{ height: "100%", paddingLeft: "1rem", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
					<ColorEdit title="Background" initialColor={custom_color_background.value} colorChanged={(c: string) => { custom_color_background.value = c, setDrawTrigger(new Date) }} />
					<ColorEdit title="Outline" initialColor={custom_color_outline.value} colorChanged={(c: string) => { custom_color_outline.value = c, setDrawTrigger(new Date) }} />
					<ColorEdit title="Text" initialColor={custom_color_text.value} colorChanged={(c: string) => { custom_color_text.value = c, setDrawTrigger(new Date) }} />
					<div style={{
						display: "flex",
						flexDirection: "column",
						marginLeft: "0.25rem",
						gap: "0.25rem",
					}}>
						<div className="cfxs-checkbox">
							<input id="round" type="checkbox" checked={custom_rounded.value} onChange={
								(e: any) => {
									custom_rounded.value = e.target.checked
									if (custom_rounded.value) {
										custom_circle.value = false
										custom_very_rounded.value = false
									}
									setDrawTrigger(new Date)
								}
							} />
							<label for="round">Rounded</label>
						</div>
						<div className="cfxs-checkbox">
							<input id="round2" type="checkbox" checked={custom_very_rounded.value} onChange={
								(e: any) => {
									custom_very_rounded.value = e.target.checked
									if (custom_very_rounded.value) {
										custom_rounded.value = false
										custom_circle.value = false
									}
									setDrawTrigger(new Date)
								}
							} />
							<label for="round2">Very Rounded</label>
						</div>
						<div className="cfxs-checkbox">
							<input id="round3" type="checkbox" checked={custom_circle.value} onChange={
								(e: any) => {
									custom_circle.value = e.target.checked
									if (custom_circle.value) {
										custom_rounded.value = false
										custom_very_rounded.value = false
									}
									setDrawTrigger(new Date)
								}
							} />
							<label for="round3">Circle</label>
						</div>
						<div className="cfxs-checkbox">
							<input id="olt" type="checkbox" checked={custom_outline_thick.value} onChange={
								(e: any) => {
									custom_outline_thick.value = e.target.checked
									setDrawTrigger(new Date)
								}
							} />
							<label for="olt">Thick Outline</label>
						</div>
						<div className="cfxs-checkbox">
							<input id="outline_bottom" type="checkbox" checked={custom_outline_bottom_only.value} onChange={
								(e: any) => {
									custom_outline_bottom_only.value = e.target.checked
									setDrawTrigger(new Date)
								}
							} />
							<label for="outline_bottom">Bottom Outline</label>
						</div>
						<div className="cfxs-checkbox">
							<input id="bold" type="checkbox" checked={custom_text_bold.value} onChange={
								(e: any) => {
									custom_text_bold.value = e.target.checked
									setDrawTrigger(new Date)
								}
							} />
							<label for="bold">Bold Text</label>
						</div>
						Font Size:
						<div className="font-sizer">
							<button onClick={() => {
								custom_text_size.value--
								setDrawTrigger(new Date)
							}}><span style="width: 100%; height: 100%; font-size: 2rem; transform: translateY(-8%);">-</span></button>
							<span>{custom_text_size.value}</span>
							<button onClick={() => {
								custom_text_size.value++
								setDrawTrigger(new Date)
							}}>+</button>
						</div>
						Text Y Offset:
						<div className="font-sizer">
							<button onClick={() => {
								custom_text_y_offset.value--
								setDrawTrigger(new Date)
							}}><span style="width: 100%; height: 100%; font-size: 2rem; transform: translateY(-8%);">-</span></button>
							<span>{custom_text_y_offset.value}</span>
							<button onClick={() => {
								custom_text_y_offset.value++
								setDrawTrigger(new Date)
							}}>+</button>
						</div>
						Unit Width:
						<div className="font-sizer">
							<button onClick={() => {
								if (custom_unit_width.value > 1) {
									custom_unit_width.value--
									setImageDim({ width: base_width.value * custom_unit_width.value, height: base_height.value })
									setDrawTrigger(new Date)
								}
							}}><span style="width: 100%; height: 100%; font-size: 2rem; transform: translateY(-8%);">-</span></button>
							<span>{custom_unit_width.value}</span>
							<button onClick={() => {
								custom_unit_width.value++
								setImageDim({ width: base_width.value * custom_unit_width.value, height: base_height.value })
								setDrawTrigger(new Date)
							}}>+</button>
						</div>
						{`Resolution: (${base_width.value} x ${base_height.value})`}
						<div className="font-sizer">
							<button onClick={() => {
								if (custom_resolution.value > 1) {
									custom_resolution.value--
									base_width.value = 64 * custom_resolution.value
									base_height.value = 64 * custom_resolution.value
									setImageDim({ width: base_width.value * custom_unit_width.value, height: base_height.value })
									setDrawTrigger(new Date)
								}
							}}><span style="width: 100%; height: 100%; font-size: 2rem; transform: translateY(-8%);">-</span></button>
							<span>{custom_resolution.value}</span>
							<button onClick={() => {
								custom_resolution.value++
								base_width.value = 64 * custom_resolution.value
								base_height.value = 64 * custom_resolution.value
								setImageDim({ width: base_width.value * custom_unit_width.value, height: base_height.value })
								setDrawTrigger(new Date)
							}}>+</button>
						</div>
					</div>
					<div style={{
						display: "flex",
						flexDirection: "column",
						marginLeft: "1rem"
					}}>
					<CheckerPattern color_a={"#111111"} color_b={"#141414"}
						style={{
							width: "16rem",
							height: "16rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							borderStyle: "solid",
							borderWidth: "2px",
							borderColor: "#555",
							boxSizing: "border-box"
						}}>
						<DrawSurface drawTrigger={drawTrigger_Custom} drawFunction={draw} data={{
							color_background: custom_color_background.value,
							color_outline: custom_color_outline.value,
								color_text: custom_color_text.value,
								font_size: custom_text_size.value,
								text: custom_text.value,
								bottom_outline: custom_outline_bottom_only.value,
								rounded: custom_rounded.value,
								very_rounded: custom_very_rounded.value,
								circle: custom_circle.value,
								thicc: custom_outline_thick.value,
								text_y_offset: custom_text_y_offset.value,
								unit_width: custom_unit_width.value,
								bold: custom_text_bold.value,
						}}
							style={{
								width: get_w(),
								height: get_h(),
							}}
							width={imageDim.width} height={imageDim.height} />
					</CheckerPattern>
						<div className="cfxs-input" style="width: 100%;">
							<input style="text-align: center; margin-top: 0.25rem; padding-left: 0.25rem;" type="text" value={custom_text.value} onChange={(e: any) => {
								custom_text.value = e.target.value
								setDrawTrigger(new Date)
							}}></input>
						</div>
					</div>
				</div>
			</TitleContainer>
		</div>
	)
}

render(<App />, document.getElementById('app'));
