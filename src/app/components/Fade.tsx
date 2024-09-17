import styled from 'styled-components';
import { fadeIn } from '../style/css';

export const Fade = styled.span<{ timing?: number | string }>`
    animation: ${fadeIn} ${(props) => props.timing || '250ms'} ease-in-out;
`;
