/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Provider } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FeedScreen, HomeScreenIcon } from 'mote/workbench/screen/home/feedScreen';
import { CreateScreen, CreateScreenIcon } from 'mote/workbench/screen/create/createScreen';
import { RootStackParamList, Router } from './route';
import { store } from 'mote/app/common/store';
import { HomeScreenStack } from './home/homeStack';


const Tab = createBottomTabNavigator<RootStackParamList>();


export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Home" component={HomeScreenStack}
                        options={{headerShown: false, tabBarShowLabel: false, tabBarIcon: HomeScreenIcon}}/>
                    <Tab.Screen name="Create" component={CreateScreen} 
                        options={{headerShown: false, tabBarShowLabel: false, tabBarIcon: CreateScreenIcon}}/>
                </Tab.Navigator>
            </NavigationContainer>
        </Provider>
    );
  }
  
