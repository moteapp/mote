import { NodeSpec } from "prosemirror-model";

export class Paragraph {
    name = "paragraph";
    schema: NodeSpec = {
        group: "block",
        content: "inline*",
        draggable: true,
        toDOM: () => ["p", 0],
    };
}

export const paragraph = new Paragraph();