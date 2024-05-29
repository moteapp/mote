import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen } from './feedScreen';
import { DocumentScreen } from 'mote/workbench/screen/document/documentScreen';
import { HomeStackParamList } from './home';


const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeScreenStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Feed" component={FeedScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Document" component={DocumentScreen} />
        </Stack.Navigator>
    )
}