import { NativeSyntheticEvent, StyleProp, TextInputChangeEventData, TextInputEndEditingEventData, TextInputKeyPressEventData, TextInputSelectionChangeEventData, TextStyle, View, Text, TextInput } from "react-native";
import { Editable } from "./editable";
import { RecordModel } from "@mote/editor/common/model/recordModel";
import { ISegment, getTextFromSegments } from "@mote/editor/common/recordCommon";
import { ViewController } from "@mote/editor/browser/view/viewController";
import { Position } from "@mote/editor/common/core/position";
import { NavigationCommandRevealType } from "@mote/editor/browser/commands/navigation";
import { useEffect, useRef } from "react";

export interface ITextbasedProps { 
    placeholder: string;
    style: StyleProp<TextStyle>;
    autoFocus?: boolean;

    lineNumber: number;
    model: RecordModel<ISegment[]>;
    viewController: ViewController;
}

export const TextBased = (props: ITextbasedProps) => {
    const textInputRef = useRef<TextInput>(null);

    const { placeholder, style, autoFocus, lineNumber, model, viewController } = props;

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        console.log('key press', e.nativeEvent.key);
    }

    const handleEndEditing = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        console.log('end editing', e.nativeEvent.text);
        viewController.lineBreak(model);
    }

    const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        viewController.type(e.nativeEvent.text, model);
    }

    const handleSelectionChange = (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
        console.log('selection change', e.nativeEvent.selection);
        const selection = e.nativeEvent.selection;
        if (selection.start == selection.end) {
            viewController.moveTo(new Position(lineNumber, selection.start), NavigationCommandRevealType.Regular);
        }
    }

    const renderContent = () => {
        
        const content = getTextFromSegments(model.value);
        console.log('render content', model.id, content);
        return <Text>{content}</Text>
    }

    useEffect(() => {
        return () => {
            textInputRef.current?.clear();
        }
    });

    return (
        <Editable {...props}
            ref={textInputRef}
            handleKeyPress={handleKeyPress}
            onChange={handleChange}
            onSelectionChange={handleSelectionChange}
            onEndEditing={handleEndEditing}
        >
            {renderContent()}
        </Editable>
    );
}