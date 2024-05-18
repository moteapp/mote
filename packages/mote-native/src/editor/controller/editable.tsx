import * as React from 'react';
import { NativeSyntheticEvent, StyleProp, TextInput, TextInputChangeEventData, TextInputEndEditingEventData, TextInputKeyPressEventData, TextInputSelectionChangeEventData, TextStyle } from "react-native"

export interface IEditableProps { 
    placeholder: string;
    style: StyleProp<TextStyle>;
    autoFocus?: boolean;
    children?: React.ReactNode;

    handleKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
    onEndEditing?: (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => void;
    onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    onSelectionChange?: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
}

export const Editable = React.forwardRef<TextInput, IEditableProps>((props, ref) => {
    const { placeholder, style, autoFocus } = props;

    console.log('')
    console.log('TextInput render');
    console.log('')

    return (
        <TextInput 
            ref={ref}
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