import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

const emptyNodeClass = "placeholder";

export const PlaceholderPlugin = (placeholder: string) => {
    const update = (view: EditorView) => {
        if (view.state.doc.textContent) {
          view.dom.removeAttribute('data-placeholder');
        } else {
          view.dom.setAttribute('data-placeholder', placeholder);
        }
      };
    return new Plugin({
        props: {
            decorations: (state) => {
                const { doc } = state;
                console.log(doc);
                return DecorationSet.create(doc, []);
            }
        },
        view(view) {
            update(view);

            return { update };
        }
    })
}