import { ThemedText } from 'mote/components/ThemedText';
import { ThemedSafeAreaView, ThemedView } from 'mote/components/ThemedView';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useEffect, useState } from 'react';
import { URL } from 'mote/constants/Env';
import { useSession } from 'mote/context/authContext';

const styles = StyleSheet.create({
    root: { padding: 20, minHeight: 300 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: {
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    cellRoot: {
        minWidth: 40,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    cellText: {
        color: '#000',
        fontSize: 36,
        textAlign: 'center',
    },
    focusCell: {
        borderBottomColor: '#007AFF',
        borderBottomWidth: 2,
    },
});

const CELL_COUNT = 6;

export default function ConfirmCodeScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [value, setValue] = useState('');
    const { signIn } = useSession();
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    useEffect(() => {
        ref.current?.focus();
    }, [ref]);

    const handleSubmit = async () => {
        if (value.length === CELL_COUNT) {
            const response = await fetch(
                `${URL}/auth/otp.callback?email=${email}&code=${value}`
            );
            if (response.ok) {
                signIn();
                router.push('/');
            } else {
                console.error('Error:', response.status, response.statusText);
            }
        }
    };

    return (
        <ThemedSafeAreaView
            style={{ flex: 1, justifyContent: 'space-between' }}
        >
            <Stack.Screen options={{ headerShown: false }} />
            <Link href="/sign-in" style={{ padding: 20 }}>
                <ThemedText>{'<'} 返回</ThemedText>
            </Link>
            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1, justifyContent: 'space-between' }}
            >
                <ThemedView>
                    <ThemedView
                        style={{ paddingTop: 20, alignItems: 'center' }}
                    >
                        <ThemedText type="subtitle">请输入验证码</ThemedText>
                    </ThemedView>
                    <ThemedView
                        style={{ paddingTop: 20, alignItems: 'center' }}
                    >
                        <CodeField
                            ref={ref}
                            {...props}
                            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                            value={value}
                            onChangeText={setValue}
                            onEndEditing={handleSubmit}
                            cellCount={CELL_COUNT}
                            rootStyle={styles.codeFieldRoot}
                            textInputStyle={{ alignItems: 'center' }}
                            keyboardType="numeric"
                            textContentType="oneTimeCode"
                            autoComplete={
                                Platform.select({
                                    android: 'sms-otp',
                                    default: 'one-time-code',
                                }) as any
                            }
                            testID="my-code-input"
                            renderCell={({ index, symbol, isFocused }) => (
                                <View
                                    // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                                    onLayout={getCellOnLayoutHandler(index)}
                                    key={index}
                                    style={[
                                        styles.cellRoot,
                                        isFocused && styles.focusCell,
                                    ]}
                                >
                                    <Text style={styles.cellText}>
                                        {symbol ||
                                            (isFocused ? <Cursor /> : null)}
                                    </Text>
                                </View>
                            )}
                        />
                    </ThemedView>
                </ThemedView>

                <ThemedView style={{ paddingBottom: 40 }}>
                    <ThemedView style={{ alignItems: 'center' }}>
                        <ThemedText>没有收到邮件?</ThemedText>
                        <ThemedText>请检查您的垃圾邮件箱</ThemedText>
                    </ThemedView>
                </ThemedView>
            </KeyboardAvoidingView>
        </ThemedSafeAreaView>
    );
}
