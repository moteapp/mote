import { SVGDataCollection } from './svgData';

export interface ISVGIconStyles {
	fill?: string;
	width?: string;
	height?: string;
    name: IconName;
}

export type IconName = keyof typeof SVGDataCollection;

export const SVGIcon = (props: ISVGIconStyles) => {
    const data = SVGDataCollection[props.name];
    const Icon = () => data.svg;
    return (
        <svg className={data.className}
            style={{width: props.width ??'100%', height: props.height ?? '100%', display: 'block', fill: props.fill}} viewBox={data.viewBox}>
            <Icon />
        </svg>
    )
}