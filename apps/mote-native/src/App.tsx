/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FeedScreen, HomeScreenIcon } from 'mote/workbench/screen/home/feedScreen';
import { CreateScreen, CreateScreenIcon } from 'mote/workbench/screen/create/createScreen';


const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={FeedScreen} options={{headerShown: false, tabBarShowLabel: false, tabBarIcon: HomeScreenIcon}}/>
                <Tab.Screen name="Create" component={CreateScreen} options={{headerShown: false, tabBarShowLabel: false, tabBarIcon: CreateScreenIcon}}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
  }
  
