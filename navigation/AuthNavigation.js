import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ResetPassword from "../screens/auth/ResetPassword";

const Stack = createStackNavigator()

export default function AuthNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Reset" component={ResetPassword} />
        </Stack.Navigator>
    )

}
