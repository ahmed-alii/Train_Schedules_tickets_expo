import React from "react";
import {Alert, Text, View} from 'react-native'
import {ListItem} from "react-native-elements";


const TrainsList = ({trains}) => (
    <View>
        {!trains && <Text style={{textAlign: "center"}}>{"Loading trains data..."}</Text>}
        {trains && trains.map((train, key) => (
            <ListItem
                key={key}
                title={"To: " + train.destination_name}
                subtitleStyle={{
                    fontSize: 17,
                    fontWeight: "500",
                    fontStyle: "italic",
                    paddingVertical: 10
                }}
                subtitle={"📍Origin: " + train.origin_name + "\n 🕑 Dept: " + train.expected_departure_time + ", Arrival: " + train.expected_arrival_time}
                titleStyle={{fontSize: 18, fontWeight: "bold"}}
                pad={25}
                bottomDivider
                onPress={() => {
                    Alert.alert(
                        train.destination_name, "\n \n Best Arrival Estimate: " + train.best_arrival_estimate_mins + " mins. \n Best Departure Estimate: "+ train.best_departure_estimate_mins+"mins."
                    )
                }}
            />
        ))}
    </View>

);

export default TrainsList;
