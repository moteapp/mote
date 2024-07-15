import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    Image,
    Button,
} from 'react-native';
import { HelloWave } from 'mote/components/HelloWave';
import { ThemedView } from 'mote/components/ThemedView';
import { ThemedText } from 'mote/components/ThemedText';
import { router } from 'expo-router';
import { useSession } from '../context/authContext';
import ParallaxScrollView from '../components/ParallaxScrollView';
import AutoScrollView from '../components/AutoScrollView';

export default function IntroScreen() {
    const { signIn } = useSession();
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/mote-512.png')}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">欢迎来到Mote!</ThemedText>
                <HelloWave />
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText>
                    Mote不仅仅是一个{' '}
                    <ThemedText type="defaultSemiBold">笔记应用</ThemedText>
                    ，它还可以是:{' '}
                </ThemedText>
            </ThemedView>

            <AutoScrollView>
                <ThemedView style={styles.taskContainer}>
                    <ThemedText>
                        一个{' '}
                        <ThemedText type="defaultSemiBold">简单</ThemedText>{' '}
                        但是{' '}
                        <ThemedText type="defaultSemiBold">
                            功能强大的
                        </ThemedText>{' '}
                        Todo应用.
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.taskContainer}>
                    <ThemedText>
                        你的{' '}
                        <ThemedText type="defaultSemiBold">日常生活</ThemedText>{' '}
                        记录者.
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.taskContainer}>
                    <ThemedText>
                        拥有{' '}
                        <ThemedText type="defaultSemiBold">人工智能</ThemedText>{' '}
                        的知识管理平台.
                    </ThemedText>
                </ThemedView>
            </AutoScrollView>

            <Button
                title="开始使用"
                onPress={() => {
                    // Navigate after signing in. You may want to tweak this to ensure sign-in is
                    // successful before navigating.
                    console.log('navigating to root');
                    router.push('/sign-in');
                }}
            />
        </ParallaxScrollView>
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
        backgroundColor: '#ffffff',
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
