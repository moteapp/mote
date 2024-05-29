import { SafeAreaView, Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DocumentScreenNavigationProp, RootStackParamList } from '../route';
import { selectHistory } from 'mote/app/common/slices/history/historySlice';
import { useAppSelector } from 'mote/app/common/hooks';
import { URI } from 'vs/base/common/uri';
import { IPointer, IRecordProvider } from '@mote/editor/common/recordCommon';
import { recordService } from 'mote/workbench/service/record/common/recordService';
import { BlockModel } from '@mote/editor/common/model/blockModel';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from './home';
import { ICommandDelegate } from '@mote/editor/browser/view/viewController';
import { Document } from 'mote/editor/widget/document';

export const HomeScreenIcon = (props: {
  focused: boolean;
  color: string;
  size: number;
}) => <IonIcon name="home-outline" size={props.size} color={props.focused ? '#1D1B16' : '#91918E'} />;



type FeedScreenProps = BottomTabScreenProps<HomeStackParamList, 'Feed'>

export const FeedScreen = (props: FeedScreenProps) => {
    const { navigation, route } = props;
 
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{paddingLeft: 10, paddingRight: 10, flex: 1}}>
                <HomeHeader />
                <VisitGallery />
            </View>
            
        </SafeAreaView>
    );
};

const HomeHeader = () => {
    return (
        <View style={{paddingLeft: 10, paddingRight: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 35}}>主页</Text>
        </View>
    );
}

const VisitGallery = () => {

    const documents = useAppSelector(selectHistory) || [];

    return (
        <ScrollView style={{paddingTop: 20, flex: 1,}}>
            <View style={{flex:1, flexWrap: 'wrap', flexDirection: 'row'}}>
                <View style={{ flexBasis: '50%'}}>
                    {documents.filter((_, idx)=>(idx+1)%2 ===1).map((entry, index) => <DocumentContainer key={index} height={180} entry={entry}/>)}
                </View>
                <View style={{ flexBasis: '50%'}}>
                    {documents.filter((_, idx)=>(idx+1)%2 ===0).map((entry, index) => <DocumentContainer key={index} height={200} entry={entry}/>)}
                </View>
            </View>
        </ScrollView>
    )
}

const DocumentContainer = (props: {entry: IPointer, height: number}) => {
    const { height, entry } = props;
    const navigation = useNavigation<DocumentScreenNavigationProp>(); 
    const recordProvider: IRecordProvider = {
        provideRecord: (uri: URI) => { 
            return recordService.getRecord(uri)!;
        }
    }
    const resource = URI.from({scheme: 'record', authority: 'block', path: '/'+entry.id})
    const pageModel = new BlockModel(resource, recordProvider);

    const handlePress = () => {
        navigation.navigate('Document', {pointer: entry});
    }

    return (
        <TouchableOpacity style={style.documentContainer} onPress={handlePress}>
            <View style={[style.document, {height}]}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>{pageModel.getText()}</Text>
                <View style={{borderColor: '#91918E32', borderBottomWidth: 1, paddingTop: 5}}></View>
                <View>
                   <Document model={pageModel} fontSize={8} readonly={true}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    documentContainer: {
        //flexBasis: '50%',
       
    },
    document: {
        borderRadius: 10, 
        backgroundColor: '#ffffff', 
        padding: 10,
        margin: 10,
    }
});