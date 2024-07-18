import { Pressable, TextInput, TextInputProps } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThemedView } from './ThemedView';
import { useRef } from 'react';

export type ThemedInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedInput({
    style,
    lightColor,
    darkColor,
    ...rest
}: ThemedInputProps) {
    const input = useRef<TextInput>(null);
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const borderColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        'border'
    );
    const inputBackground = useThemeColor(
        { light: lightColor, dark: darkColor },
        'inputBackground'
    );

    return (
        <Pressable
            onPress={() => input.current?.focus()}
            style={{ width: '100%', alignItems: 'center' }}
        >
            <ThemedView
                style={[
                    {
                        borderColor: borderColor,
                        borderWidth: 1,
                        borderRadius: 10,
                        width: '80%',
                        marginLeft: 20,
                        marginRight: 20,
                        backgroundColor: inputBackground,
                        alignItems: 'center',
                    },
                    style,
                ]}
            >
                <TextInput
                    ref={input}
                    style={[{ color, padding: 10, fontWeight: 'bold' }]}
                    placeholderTextColor={color}
                    {...rest}
                />
            </ThemedView>
        </Pressable>
    );
}
