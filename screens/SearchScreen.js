import React, {useState} from "react";
import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View, Alert} from 'react-native'
import {ListItem, SearchBar} from "react-native-elements";
import {searchStations} from "../constants/stations";
import {Firebase} from "../connection/comms";
import {saveData} from "../connection/AsyncStorage";
import UserContext from "../connection/userContext";


export default function SearchScreen({navigation}) {
    const [search, setSearch] = useState("");
    const [Loading, setLoading] = useState(true)
    const [stations, setStations] = useState(undefined)
    const [refreshing, setRefreshing] = useState(false);

    let updateSearch = search => {
        setSearch(search);
    }

    const loadDataInView = () => {
        if (search !== "") {
            const stationCodes = searchStations(search)
            setStations(stationCodes)
            setLoading(false)
            setRefreshing(false)
        }
    }


    const onRefresh = () => {
        loadDataInView()
        setRefreshing(true)
        setLoading(true)

    }

    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
        <SafeAreaView style={styles.container}>
            <SearchBar
                platform="ios"
                cancelButtonTitle="Cancel"
                placeholder='Search trains by stations'
                value={search}
                onChangeText={updateSearch}
                onSubmitEditing={loadDataInView}
                containerStyle={{paddingVertical: 50, backgroundColor: "#fff"}}
            />
            <ScrollView style={styles.container}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            >
                {stations && stations.map((station, key) => {

                    const name = Object.keys(station)[0]
                    const code = station[name]
                    return (
                        <ListItem
                            leftElement={
                                <View>
                                    <Text style={{fontSize: 30}}>
                                        🚂
                                    </Text>
                                </View>
                            }
                            onLongPress={() => {
                                Firebase.updateCity(code, loggedIn.uid).then(r => {
                                    if (r === true) {
                                        setLoggedin(previousState => ({...previousState, city: code}));
                                        saveData(loggedIn).then(
                                            Alert.alert("Default station updated.", name)
                                        )
                                    }
                                })
                            }}
                            key={key}
                            title={name}
                            titleStyle={{fontWeight: "bold"}}
                            subtitle={"👉🏼 "+code}
                            onPress={()=>{
                                navigation.navigate("Details", {
                                    stationName: name,
                                    stationCode: code
                                });
                            }}
                        />
                    )

                })}
            </ScrollView>
        </SafeAreaView>
            )}
        </UserContext.Consumer>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchHeader: {}
});
