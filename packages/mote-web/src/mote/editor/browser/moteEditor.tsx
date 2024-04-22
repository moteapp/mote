import { MonacoEditor } from 'mote/editor/browser/monacoEditor';
import { IHoverService } from 'vs/platform/hover/browser/hover';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';

interface MoteEditorProps {
    height: number;
    width: number;
    hoverService: IHoverService
}

export const MoteEditor = (props: MoteEditorProps) => {
    return (
        <div>
            <MonacoEditor hoverService={props.hoverService}/>;
        </div>
    );
}