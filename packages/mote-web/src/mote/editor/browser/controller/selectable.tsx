import { ISegment } from "mote/editor/common/recordCommon";
import { RecordModel } from "mote/editor/common/model/recordModel";

export interface SelectableProps {
    children: React.ReactNode;
    model: RecordModel<ISegment[]>;
}

export const Selectable = (props: SelectableProps) => {
    return (
        <div className="selectable" data-block-id={props.model.id}>
            {props.children}
        </div>
    )
}