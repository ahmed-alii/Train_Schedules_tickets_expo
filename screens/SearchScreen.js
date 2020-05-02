import React, {useContext, useEffect, useState} from "react";
import {Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
import {Avatar, ListItem, SearchBar} from "react-native-elements";
import UserContext from "../connection/userContext";
import {Firebase} from "../connection/comms";


export default function SearchScreen({navigation}) {
    const [search, setSearch] = useState("");
    const [Loading, setLoading] = useState(true)
    const [trains, setTrains] = useState(undefined)
    const [refreshing, setRefreshing] = useState(false);

    let updateSearch = search => {
        setSearch(search);
    }

    const loadDataInView = () => {
        Firebase.getTrainsWithUserCity(search).then(r => {
            if (r.length === 0) {
                if (search !== ""){
                    alert("😐 No trains found")
                }
            }
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
        <SafeAreaView style={styles.container}>
            <SearchBar
                platform="ios"
                cancelButtonTitle="Cancel"
                placeholder='Search trains by location'
                value={search}
                onChangeText={updateSearch}
                onSubmitEditing={loadDataInView}
                containerStyle={{paddingVertical: 50, backgroundColor: "#fff"}}
            />
            <Text style={{
                fontSize: 15,
                fontStyle: "italic",
                fontWeight: "200",
                color: "grey",
                textAlign: "center", marginVertical: 20
            }}>...Search for trains. Click to view prices...</Text>
            <ScrollView style={styles.container}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            >
                {!trains && <Text style={{textAlign: "center"}}>{"Loading trains data..."}</Text>}
                {trains && trains.map((train, key) => (
                    <ListItem
                        leftElement={() => {
                            return (
                                <View style={{alignItems:"center"}}>
                                    <Avatar title={train.tickets} size={"medium"} rounded/>
                                    <Text style={{
                                        width: 70,
                                        fontWeight: "bold",
                                        fontSize: 15,
                                        lineHeight: 25,
                                        color: "grey",
                                        paddingTop: 5,
                                        textAlign: "center"
                                    }}>
                                        tickets
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
            </ScrollView>
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchHeader: {}
});
