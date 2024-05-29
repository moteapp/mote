import * as React from 'react';
import { NativeSyntheticEvent, StyleProp, TextInput, TextInputChangeEventData, TextInputEndEditingEventData, TextInputKeyPressEventData, TextInputSelectionChangeEventData, TextStyle } from "react-native"

export interface IEditableProps { 
    placeholder: string;
    style: StyleProp<TextStyle>;
    autoFocus?: boolean;
    readonly?: boolean;
    children?: React.ReactNode;

    handleKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
    onEndEditing?: (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => void;
    onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    onSelectionChange?: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
}

export const Editable = React.forwardRef<TextInput, IEditableProps>((props, ref) => {
    const { placeholder, style, autoFocus, readonly } = props;

    console.log('')
    console.log('TextInput render');
    console.log('')

    return (
        <TextInput 
            ref={ref}
            readOnly={readonly}
            placeholder={placeholder} 
            style={style} 
            autoFocus={autoFocus}
            onChange={props.onChange}
            onKeyPress={props.handleKeyPress}
            //onEndEditing={props.onEndEditing}
            onSelectionChange={props.onSelectionChange}
            onSubmitEditing={props.onEndEditing}
        >
            {props.children}
        </TextInput>
    );
})