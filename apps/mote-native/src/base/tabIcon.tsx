import IonIcon from 'react-native-vector-icons/Ionicons';

export const TabIcon = (props: {
    focused: boolean;
    color: string;
    size: number;
  }) => <IonIcon name="home-outline" size={props.size} color={props.focused ? '#1D1B16' : '#91918E'} />;
  