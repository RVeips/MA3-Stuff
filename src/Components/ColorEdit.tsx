import "./ColorEdit.scss"
import { useEffect, useRef, useState } from 'preact/hooks';
import { HexColorPicker } from "react-colorful";
import { TitleContainer } from "./TitleContainer";
import { CSSProperties } from "preact/compat";

function hex_color_to_rgb(hex: string) {
	// Format: #rgb or #rrggbb

	let temp = hex.substring(1);
	let r, g, b: number;
	if (temp.length === 3) {
		[r, g, b] = temp.split('').map((char) => {
			char = char + char;
			return parseInt(char, 16);
		});
	} else {
		[r, g, b] = temp.split(/(?=(?:..)*$)/).map((hex) => parseInt(hex, 16));
	}
	return { r, g, b };
}

function rgb_to_hex(c: { r: number, g: number, b: number }) {
	const hex = "0123456789ABCDEF"
	let r = c.r
	let g = c.g
	let b = c.b
	let hex_r = hex[(r & 0xF0) >> 4] + hex[r & 0x0F]
	let hex_g = hex[(g & 0xF0) >> 4] + hex[g & 0x0F]
	let hex_b = hex[(b & 0xF0) >> 4] + hex[b & 0x0F]
	return `#${hex_r}${hex_g}${hex_b}`
}

function validate(e) {
	(e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/\D+/g, '');
	(e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/^0+/g, '');
	if ((e.target as HTMLInputElement).value.length == 0)
		(e.target as HTMLInputElement).value = "0"
	if (parseInt((e.target as HTMLInputElement).value) > 255)
		(e.target as HTMLInputElement).value = "255"
}

export const ColorEdit = (props: {
	title: string,
	colorChanged: Function,
	initialColor: string,
	style?: CSSProperties
}) => {
	const [color, setColor] = useState(props.initialColor);
	const ic = hex_color_to_rgb(color);
	const [r, setR] = useState(ic.r);
	const [g, setG] = useState(ic.g);
	const [b, setB] = useState(ic.b);

	const ref_Indicator = useRef<HTMLDivElement>()

	useEffect(() => {
		if (ref_Indicator.current)
			ref_Indicator.current.style.backgroundColor = color
	}, [ref_Indicator])

	return <TitleContainer style={props.style ?? {}} title={props.title} className="color-editor">
		<HexColorPicker color={color} onChange={c => {
			const ic = hex_color_to_rgb(c);
			setR(ic.r);
			setG(ic.g);
			setB(ic.b);
			if (props.colorChanged)
				props.colorChanged(c)
			if (ref_Indicator.current)
				ref_Indicator.current.style.backgroundColor = c
		}} />
		<div className="rgb">
			<div ref={ref_Indicator} className="color-indicator"></div>
			<div className="cfxs-input rgb-component">
				<input onChange={(e) => {
					validate(e)
					const value = (e.target as HTMLInputElement).value
					setR(parseInt(value))
					if (props.colorChanged)
						props.colorChanged(rgb_to_hex({ r: parseInt(value), g, b }))
					if (ref_Indicator.current)
						ref_Indicator.current.style.backgroundColor = rgb_to_hex({ r: parseInt(value), g, b })
					setColor(rgb_to_hex({ r: parseInt(value), g, b }))
				}} className="input-r" type="text" inputmode="numeric" maxLength={3} value={r} />
				<label className="label-r">R</label>
			</div>
			<div className="cfxs-input rgb-component">
				<input onChange={(e) => {
					validate(e)
					const value = (e.target as HTMLInputElement).value
					setG(parseInt(value))
					if (props.colorChanged)
						props.colorChanged(rgb_to_hex({ r, g: parseInt(value), b }))
					if (ref_Indicator.current)
						ref_Indicator.current.style.backgroundColor = rgb_to_hex({ r, g: parseInt(value), b })
					setColor(rgb_to_hex({ r, g: parseInt(value), b }))
				}} className="input-g" type="text" inputmode="numeric" maxLength={3} value={g} />
				<label className="label-g" >G</label>
			</div>
			<div className="cfxs-input rgb-component">
				<input onChange={(e) => {
					validate(e)
					const value = (e.target as HTMLInputElement).value
					setB(parseInt(value))
					if (props.colorChanged)
						props.colorChanged(rgb_to_hex({ r, g, b: parseInt(value) }))
					if (ref_Indicator.current)
						ref_Indicator.current.style.backgroundColor = rgb_to_hex({ r, g, b: parseInt(value) })
					setColor(rgb_to_hex({ r, g, b: parseInt(value) }))
				}} className="input-b" type="text" inputmode="numeric" maxLength={3} value={b} />
				<label className="label-b">B</label>
			</div>
		</div>
	</TitleContainer>
}