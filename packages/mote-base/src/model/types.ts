export type ProsemirrorData = {
    type: string;
    content: ProsemirrorData[];
    text?: string;
    attrs?: JSONObject;
    marks?: {
        type: string;
        attrs: JSONObject;
    }[];
};

export type JSONValue =
    | string
    | number
    | boolean
    | undefined
    | null
    | { [x: string]: JSONValue }
    | Array<JSONValue>;

export type JSONObject = { [x: string]: JSONValue };
