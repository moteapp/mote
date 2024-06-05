import { SVGDataCollection } from './svgData';

export interface ISVGIconStyles {
	fill?: string;
	width?: string;
	height?: string;
    name: IconName;
    style?: React.CSSProperties;
}

export type IconName = keyof typeof SVGDataCollection;

export const SVGIcon = (props: ISVGIconStyles) => {
    const data = SVGDataCollection[props.name];
    const Icon = () => data.svg;
    const style = Object.assign({width: props.width ??'30px', height: props.height ?? '30px', display: 'block', fill: props.fill}, props.style);

    return (
        <svg className={data.className}
            style={style} viewBox={data.viewBox}>
            <Icon />
        </svg>
    )
}