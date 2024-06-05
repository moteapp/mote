import { EditorView } from 'prosemirror-view';
import {Plugin} from 'prosemirror-state';
import {toggleMark, setBlockType, wrapIn} from 'prosemirror-commands';
import {schema} from 'prosemirror-schema-basic';

interface IMenuItem {
    dom: HTMLElement;
    command: Function;
}

export class MenuPart {

    public readonly dom: HTMLElement;

    constructor(
        private items: IMenuItem[], 
        private editorView: EditorView

    ) {
   
      this.dom = document.createElement("div")
      this.dom.className = "menubar"
      items.forEach(({dom}) => this.dom.appendChild(dom))
      this.update()
  
      this.dom.addEventListener("mousedown", e => {
        e.preventDefault()
        editorView.focus()
        items.forEach(({command, dom}) => {
          if (dom.contains(e.target as any))
            command(editorView.state, editorView.dispatch, editorView)
        })
      })
    }
  
    update() {
      this.items.forEach(({command, dom}) => {
        let active = command(this.editorView.state, null, this.editorView)
        dom.style.display = active ? "" : "none"
      })
    }
  
    destroy() { this.dom.remove() }
}

export function menuPlugin(items: IMenuItem[]) {
    return new Plugin({
      view(editorView) {
        let menuView = new MenuPart(items, editorView);
        editorView.dom.parentNode!.insertBefore(menuView.dom, editorView.dom);
        return menuView;
      }
    });
}

// Helper function to create menu icons
function icon(text: string, name: string) {
    let span = document.createElement("span")
    span.className = "menuicon " + name
    span.title = name
    span.textContent = text
    return span
}

// Create an icon for a heading at the given level
function heading(level: number) {
    return {
      command: setBlockType(schema.nodes.heading, {level}),
      dom: icon("H" + level, "heading")
    }
}
  

export const menuBar = menuPlugin([
    {command: toggleMark(schema.marks.strong), dom: icon("B", "b")},
    {command: toggleMark(schema.marks.em), dom: icon("i", "i")},
    {command: setBlockType(schema.nodes.paragraph), dom: icon("p", "paragraph")},
    heading(1), heading(2), heading(3),
    {command: wrapIn(schema.nodes.blockquote), dom: icon(">", "blockquote")}
]);