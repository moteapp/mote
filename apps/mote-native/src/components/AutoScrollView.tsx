import { PropsWithChildren } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { ThemedView } from './ThemedView';
import Animated from 'react-native-reanimated';

export default function AutoScrollView({ children }: PropsWithChildren) {
    return (
        <ThemedView>
            <Animated.ScrollView scrollEventThrottle={16}>
                <ThemedView style={styles.content}>{children}</ThemedView>
            </Animated.ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 250,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: 'hidden',
    },
});
