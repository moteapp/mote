import { View, Text, Button, TouchableOpacity } from "react-native"

interface IQuickMenuProps {
    onBold?: () => void;
    onItalic?: () => void;
    onStrikeThrough?: () => void;
}


interface IActionProps {
    label?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
}

const Action = (props: IActionProps) => {
    const { label, icon } = props;

    const renderLabel = () => label;
    const renderIcon = () => icon;
    return (
        <View style={{paddingLeft: 15, paddingRight: 15}}>
            <TouchableOpacity onPress={props.onClick}>
                {renderIcon()}
                {renderLabel()}
            </TouchableOpacity>
        </View>
    )
}

export const QuickMenu = (props: IQuickMenuProps) => {
    return (
        <View style={{flexDirection: 'row', backgroundColor: '#ffffff', height: 45, paddingTop: 10, paddingBottom: 10}}>
            <Action label={<Text style={{fontWeight:'bold', fontSize: 22}}>B</Text>} onClick={props.onBold}/>
            <Action label={<Text style={{fontStyle: 'italic', fontSize: 22}}>I</Text>} onClick={props.onItalic}/>
            <Action label={<Text style={{textDecorationLine: 'line-through', fontSize: 22}}>S</Text>} onClick={props.onStrikeThrough}/>
        </View>
    )
}