import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from "react-native";
import { URI } from "vs/base/common/uri";
import { generateUuid } from "vs/base/common/uuid";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../route";
import { MoteEditor } from "mote/editor/widget/moteEditor";

type DocumentScreenProps = BottomTabScreenProps<RootStackParamList, 'Document'>


export const DocumentScreen = (props: DocumentScreenProps) => {
    const { route } = props;
    const pointer = route.params.pointer;

    const resource = URI.from({scheme: 'record', authority: 'block', path: '/'+pointer.id});

    return (
        <SafeAreaView style={{flex: 1}}>
            <MoteEditor resource={resource}/>
        </SafeAreaView>
    );
}