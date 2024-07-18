import { ThemedText } from 'mote/components/ThemedText';
import { ThemedSafeAreaView, ThemedView } from 'mote/components/ThemedView';

export default function HomeScreen() {
    return (
        <ThemedSafeAreaView style={{ flex: 1 }}>
            <ThemedView style={{ paddingLeft: 20, paddingRight: 20 }}>
                <ThemedText type="title">主页</ThemedText>
            </ThemedView>
        </ThemedSafeAreaView>
    );
}
