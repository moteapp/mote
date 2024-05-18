import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { URI } from 'vs/base/common/uri';
import { generateUuid } from 'vs/base/common/uuid';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp, RootStackParamList } from '../route';
import { useAppDispatch } from 'mote/app/common/hooks';
import { addToHistory } from 'mote/app/common/slices/history/historySlice';
import { MoteEditor } from 'mote/editor/widget/moteEditor';
import { useEffect, useState } from 'react';

export const CreateScreenIcon = (props: {
    focused: boolean;
    color: string;
    size: number;
}) => <IonIcon name="create-outline" size={props.size} color={props.focused ? '#1D1B16' : '#91918E'} />;


type CreateScreenProps = BottomTabScreenProps<RootStackParamList, 'Create'>

export const CreateScreen = ({ navigation }: CreateScreenProps) => {

    const [ resource, setResource ] = useState<URI | undefined>(undefined);
    
    useEffect(() => {
        const disposeable = navigation.addListener('focus', () => {
            console.log('------------ CreateScreen focused --------------------');
            setResource(URI.from({scheme: 'record', authority: 'block', path: '/'+generateUuid()}));
        });
        return disposeable;
    }, [navigation]);

    if (!resource) {
        return null;
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flexDirection: 'row-reverse'}}>
                <DoneButton uri={resource}/>
            </View>
            <MoteEditor resource={resource}/>
        </SafeAreaView>
    );
};

const DoneButton = (props: {uri: URI}) => {

    const navigation = useNavigation<HomeScreenNavigationProp>();
    const appDispatch = useAppDispatch();

    const handlePress = () => {
        appDispatch(addToHistory({id: props.uri.path.substring(1), table: props.uri.authority}));
        navigation.navigate('Home');
    }

    return (
        <View style={{width: 80}}>
            <TouchableOpacity onPress={handlePress}>
                <View style={{padding: 10, backgroundColor: '#1D1B16', borderRadius: 15, margin: 10, }}>
                <Text style={{color: 'white', textAlign: 'center'}}>Done</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}