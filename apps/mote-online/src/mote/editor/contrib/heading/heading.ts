import { NodeSpec } from "prosemirror-model";

class Heading {
    get name() {
        return "heading";
    }

    get schema(): NodeSpec {
        return {
            attrs: {
                level: {
                  default: 1,
                },
                collapsed: {
                  default: undefined,
                },
            },
            group: "block",
            content: "inline*",
            toDOM: (node) => {
                let anchor, fold;
                if (typeof document !== "undefined") {
                    anchor = document.createElement("button");
                    anchor.innerText = "#";
                    anchor.type = "button";
                    anchor.className = "heading-anchor";
                    //anchor.addEventListener("click", this.handleCopyLink);

                    fold = document.createElement("button");
                    fold.innerText = "";
                    fold.innerHTML =
                        '<svg fill="currentColor" width="12" height="24" viewBox="6 0 12 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.23823905,10.6097108 L11.207376,14.4695888 L11.207376,14.4695888 C11.54411,14.907343 12.1719566,14.989236 12.6097108,14.652502 C12.6783439,14.5997073 12.7398293,14.538222 12.792624,14.4695888 L15.761761,10.6097108 L15.761761,10.6097108 C16.0984949,10.1719566 16.0166019,9.54410997 15.5788477,9.20737601 C15.4040391,9.07290785 15.1896811,9 14.969137,9 L9.03086304,9 L9.03086304,9 C8.47857829,9 8.03086304,9.44771525 8.03086304,10 C8.03086304,10.2205442 8.10377089,10.4349022 8.23823905,10.6097108 Z" /></svg>';
                    fold.type = "button";
                    fold.className = `heading-fold ${
                        node.attrs.collapsed ? "collapsed" : ""
                    }`;
                    fold.addEventListener("mousedown", (event) =>
                        this.handleFoldContent(event)
                    );
                }
                return [
                    `h${node.attrs.level + 0}`,
                    [
                        "span",
                        {
                            contentEditable: "false",
                            class: `heading-actions ${
                                node.attrs.collapsed ? "collapsed" : ""
                            }`,
                        },
                        ...(anchor ? [anchor, fold] : []),
                    ],
                    [
                        "span",
                        {
                            class: "heading-content",
                        },
                        0,
                    ],
                ]
            },
        }
    }

    handleFoldContent = (event: MouseEvent) => {

    }
}

export const heading = new Heading();