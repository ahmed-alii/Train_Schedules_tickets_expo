import React, {useContext, useEffect, useState} from 'react';
import {Alert, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native'
import {ListItem} from "react-native-elements";
import UserContext from "../connection/userContext";
import {Firebase} from "../connection/comms";

export default function HomeScreen({navigation}) {
  const [Loading, setLoading] = useState(true)
  const [trains, setTrains] = useState(undefined)
  const [refreshing, setRefreshing] = useState(false);
  const {loggedIn, setLoggedin} = useContext(UserContext)


  const loadDataInView = () => {
    Firebase.getTrainsWithUserCity(loggedIn.city).then(r => {
      setTrains(r)
      setLoading(false)
      setRefreshing(false)
    })
  }

  useEffect(() => {
    if (Loading === true) {
      loadDataInView()
    }
  })

  const onRefresh = () => {
    loadDataInView()
    setRefreshing(true)
    setLoading(true)

  }


  return (
      <UserContext.Consumer>
        {({loggedIn, setLoggedin}) => (
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.smallText}>
                  Showing All Trains For Your Location
                </Text>

                <Text style={styles.title}>
                  🗺 {loggedIn.city}
                </Text>
              </View>
              <ScrollView style={styles.container}
                          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
              >
                {!trains && <Text style={{textAlign: "center"}}>{"Loading trains data..."}</Text>}
                {trains && trains.map((train, key) => (
                    <ListItem
                        leftElement={() => {
                          return (
                              <View>
                                <Text style={{
                                  width: 70,
                                  fontWeight: "bold",
                                  fontSize: 16,
                                  lineHeight: 25,
                                  color: "blue",
                                  textAlign: "center"
                                }}>
                                  {train.name}
                                </Text>
                              </View>

                          )
                        }}

                        title={train.dStation + " to " + train.aStation}
                        subtitleStyle={{
                          fontSize: 17,
                          fontWeight: "500",
                          fontStyle: "italic",
                          paddingVertical: 10
                        }}
                        subtitle={"🕰 Dept: " + train.dTime + ", Arrival: " + train.aTime + "\n🗓 Date: " + train.date}
                        titleStyle={{fontSize: 18, fontWeight: "bold"}}
                        pad={25}
                        bottomDivider
                        onPress={() => {
                          Alert.alert(
                              train.name + "\n" + train.dStation + " to " + train.aStation,
                              "Kids Ticket Price : " + train.priceKidsTicket + "\n"
                              + "Adult Ticket Price: " + train.priceAdultsTicket
                          )
                        }}
                    />
                ))}

                <Text style={{textAlign: "center", paddingVertical: 20}}>{"No more trains leaving today 🚏"}</Text>
              </ScrollView>
            </View>
        )}
      </UserContext.Consumer>


  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  smallText: {
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "200",
    color: "grey"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold"
  }
});
