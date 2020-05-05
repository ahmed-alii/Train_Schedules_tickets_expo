import React, {useContext, useEffect, useState} from 'react';
import {Alert, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native'
import {ListItem} from "react-native-elements";
import UserContext from "../connection/userContext";
import {Fetch, Firebase} from "../connection/comms";
import TrainsList from "../components/TrainsDetailsList";

export default function HomeScreen({navigation}) {
  const [Loading, setLoading] = useState(true)
  const [trains, setTrains] = useState(undefined)
  const [refreshing, setRefreshing] = useState(false);
  const {loggedIn, setLoggedin} = useContext(UserContext)


  const loadDataInView = () => {
    Fetch.getData(loggedIn.city).then(res => {
      if(res.error){
        alert(res.error)
        setLoading(false)
        setRefreshing(false)
      }else{
        setTrains(res.departures.all)
        setLoading(false)
        setRefreshing(false)
      }
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
              <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                <TrainsList trains={trains}/>
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
