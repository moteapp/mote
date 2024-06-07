import styled from "styled-components";
import Fade from "../fade/fade";
import { TextPlaceholder } from "../placeholder/placeholder";
import Flex from "../flex";
import { DelayedMount } from "../delayedMount";

interface IDocumentPlaceholderProps {
    includeTitle?: boolean;
    delay?: number;
}

export const DocumentPlaceholder = ({includeTitle, delay}: IDocumentPlaceholderProps) => {
    const content = (
        <>
          <TextPlaceholder delay={0.2} />
          <TextPlaceholder delay={0.4} />
          <TextPlaceholder delay={0.6} />
        </>
    );

    if (includeTitle === false) {
        return (
            <DelayedMount delay={delay}>
                <Fade>
                    <Flex column auto>
                        {content}
                    </Flex>
                </Fade>
            </DelayedMount>
        );
    }

    return (
        <DelayedMount >
            <Wrapper>
                <Fade>
                    <Flex column auto>
                        <TextPlaceholder height={34} maxWidth={70} />
                        <TextPlaceholder delay={0.2} maxWidth={40} />
                        <br />

                        {content}
                    </Flex>
                </Fade>
            </Wrapper>
        </DelayedMount>
    )
}

const Wrapper = styled(Fade)`
  display: block;
  margin: 6vh 0;
  padding: 12px 0;
`;