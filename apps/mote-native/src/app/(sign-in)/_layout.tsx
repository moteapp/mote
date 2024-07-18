import { Redirect, Slot, Stack } from 'expo-router';

export default function SignInLayout() {
    // This layout can be deferred because it's not the root layout.
    return (
        <Stack>
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="confirm-code" />
        </Stack>
    );
}
