import { router } from 'expo-router';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    TextInput,
    Button,
} from 'react-native';

import { useSession } from 'mote/context/authContext';
import { ThemedSafeAreaView, ThemedView } from 'mote/components/ThemedView';
import { ThemedText } from 'mote/components/ThemedText';
import { ThemedInput } from 'mote/components/ThemedInput';
import { useThemeColor } from 'mote/hooks/useThemeColor';
import { useState } from 'react';

export default function SignIn() {
    const { signIn } = useSession();
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const [email, setEmail] = useState('');

    const requestOneTimePassword = async () => {
        // Navigate after signing in. You may want to tweak this to ensure sign-in is
        // successful before navigating.
        const response = await fetch('https://app.mote.dev/auth/otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
        }).catch((error) => console.error('Error:', error));
        if (!response) {
            return;
        }
        if (response.ok) {
            router.push(`/confirm-code?email=${email}`);
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    };

    return (
        <ThemedSafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <ThemedView
                style={[
                    styles.stepContainer,
                    {
                        paddingTop: 70,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingLeft: 40,
                        paddingRight: 40,
                    },
                ]}
            >
                <ThemedText type="subtitle">输入邮箱并开始使用</ThemedText>
                <ThemedText
                    style={{ paddingTop: 20, color: secondaryTextColor }}
                >
                    我们将会向您的邮箱发送一个{' '}
                    <ThemedText
                        type="defaultSemiBold"
                        style={{ color: secondaryTextColor }}
                    >
                        验证码
                    </ThemedText>
                </ThemedText>
                <ThemedText style={{ color: secondaryTextColor }}>
                    你可以使用它来登录.
                </ThemedText>
            </ThemedView>

            <ThemedView style={{ paddingTop: 30 }} />
            <ThemedInput
                textContentType="emailAddress"
                placeholder="你的邮箱"
                onChangeText={setEmail}
                value={email}
            />

            <ThemedView style={{ paddingTop: 20 }}>
                <Button title="下一步" onPress={requestOneTimePassword} />
            </ThemedView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    taskContainer: {
        gap: 8,
        marginBottom: 8,
        borderRadius: 8,
        padding: 15,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
