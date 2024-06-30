import Flex from 'mote/base/components/flex';
import { PortalContext } from 'mote/base/components/portal';
import { PureComponent, createContext, createRef, useContext } from 'react';
import styled, { css } from 'styled-components';
import { EditorContainer } from './editorContainer';
import { transparentize } from 'polished';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import {
    Schema,
    NodeSpec,
    MarkSpec,
    Node as ProsemirrorNode,
} from 'prosemirror-model';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { PlaceholderPlugin } from './contrib/placeholder/placeholder';
import { heading } from './contrib/heading/heading';
import { paragraph } from './contrib/paragraph/paragraph';

const EditorContext = createContext<EditorWidget|null>(null);
export const useEditor = () => useContext(EditorContext);

export interface IEditorWidgetProps {
    /** Placeholder displayed when the editor is empty */
    placeholder: string;
    /** The editor content, should only be changed if you wish to reset the content */
    value?: string;
    /** The initial editor content as a markdown string or JSON object */
    defaultValue: string | object;
}

type State = {
    /** If the document text has been detected as using RTL script */
    isRTL: boolean;
    /** If the editor is currently focused */
    isEditorFocused: boolean;
    /** If the toolbar for a text selection is visible */
    selectionToolbarOpen: boolean;
    /** If the insert link toolbar is visible */
    linkToolbarOpen: boolean;
};

export class EditorWidget extends PureComponent<IEditorWidgetProps, State> {

    private elementRef = createRef<HTMLDivElement>();
    private wrapperRef = createRef<HTMLDivElement>();

    state: State = {
        isRTL: false,
        isEditorFocused: false,
        selectionToolbarOpen: false,
        linkToolbarOpen: false,
    };

    private view!: EditorView;

    private initialize() {
        this.schema = this.createSchema();
        this.view = this.createView();
    }

    private createDocument(content: string | object) {
        if (typeof content === "string") {
            return undefined;
        }
        return ProsemirrorNode.fromJSON(this.schema, content);
    }

    private createState(value?: string | object) {
        const doc = this.createDocument(value || this.props.defaultValue);
        return EditorState.create({
            schema: this.schema,
            doc,
            plugins: [
                keymap(baseKeymap),
                PlaceholderPlugin(this.props.placeholder)
            ]
        });
    }

    private schema!: Schema;
    private createSchema() {
        return new Schema({
            nodes: {
                text: {
                    group: "inline",
                },
                paragraph: paragraph.schema,
                heading: heading.schema,
                doc: {content: "block+"}
            }
        });
    }

    private createView() {
        if (!this.elementRef.current) {
            throw new Error("createView called before ref available");
        }

        if (this.elementRef.current.children.length > 0) {
            return this.view;
        }

        const view = new EditorView(this.elementRef.current, {
            state: this.createState(this.props.value),
            //plugins: [PlaceholderPlugin(this.props.placeholder)]
        });

        this.view = view;

        return view;
    }

    componentDidMount(): void {
        console.log('componentDidMount');
        this.initialize();
    }

    render() {

        const { isRTL } = this.state;

        return (
            <PortalContext.Provider value={this.wrapperRef.current}>
                <EditorContext.Provider value={this}>
                    <Flex
                        ref={this.wrapperRef}
                        $align="flex-start"
                        justify="center"
                        $column
                    >
                        <EditorContainerWrapper 
                            rtl={isRTL}
                            ref={this.elementRef}
                        />
                    </Flex>
                </EditorContext.Provider>
            </PortalContext.Provider>
        )
    }
}

const EditorContainerWrapper = styled(EditorContainer)<{ focusedCommentId?: string }>`
  ${(props) =>
    props.focusedCommentId &&
    css`
      #comment-${props.focusedCommentId} {
        background: ${transparentize(0.5, props.theme.brand.marine)};
      }
    `}
`;