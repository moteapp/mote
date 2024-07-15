import { router } from 'expo-router';
import { SafeAreaView, Text, View, StyleSheet, TextInput } from 'react-native';

import { useSession } from 'mote/context/authContext';
import { ThemedSafeAreaView, ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

export default function SignIn() {
    const { signIn } = useSession();
    return (
        <ThemedSafeAreaView
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <ThemedView
                style={[
                    styles.stepContainer,
                    { paddingTop: 20, justifyContent: 'center' },
                ]}
            >
                <ThemedText type="subtitle">输入邮箱并开始使用</ThemedText>
                <ThemedText>
                    我们将会向您的邮箱发送一个{' '}
                    <ThemedText type="defaultSemiBold">验证码</ThemedText>
                    ，输入并登录
                </ThemedText>
            </ThemedView>
            <ThemedView>
                <TextInput
                    textContentType="emailAddress"
                    placeholder="你的邮箱"
                />
            </ThemedView>
            <Text
                onPress={() => {
                    console.log('trigger signing in');
                    signIn();
                    // Navigate after signing in. You may want to tweak this to ensure sign-in is
                    // successful before navigating.
                    console.log('navigating to root');
                    router.replace('/');
                }}
            >
                Sign In
            </Text>
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
