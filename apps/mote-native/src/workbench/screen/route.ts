import { IPointer } from '@mote/editor/common/recordCommon';
import { BottomTabScreenProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    Home: undefined;
    Create: { userId: string };
    Document: { pointer: IPointer };
    Feed: { sort: 'latest' | 'top' } | undefined;
};

export type HomeScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'Home'>;
export type DocumentScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'Document'>;


export const Router: Record<string, keyof RootStackParamList> = {
    Home: 'Home',
}