import React, {useState} from "react";
import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
import {ListItem, SearchBar} from "react-native-elements";
import {searchStations} from "../../constants/stations";


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
                            key={key}
                            title={name}
                            titleStyle={{fontWeight: "bold"}}
                            subtitle={code}
                            onPress={()=>{
                                navigation.navigate("Register", {
                                    stationCode: code
                                });
                            }}
                        />
                    )

                })}
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
