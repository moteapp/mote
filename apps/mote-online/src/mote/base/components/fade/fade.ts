import { fadeIn } from 'mote/app/styles/animations';
import styled from 'styled-components';

const Fade = styled.span<{ timing?: number | string }>`
  animation: ${fadeIn} ${(props) => props.timing || "250ms"} ease-in-out;
`;

export default Fade;
