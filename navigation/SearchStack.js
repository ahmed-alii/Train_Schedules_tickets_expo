import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SearchScreen from "../screens/SearchScreen";
import DetailsScreen from "../screens/DetailsScreen";


const Stack = createStackNavigator()

export default function SearchStack() {
    return (
        <Stack.Navigator headerMode={"none"}>
            <Stack.Screen name="Search" component={SearchScreen}/>
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    )

}
