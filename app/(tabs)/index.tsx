import { Image, StyleSheet, Platform, View, Text, FlatList, ActivityIndicator, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Character
{
    name: string;
    id: string;
    status: string;
    species: string;
    gender: string;
    image: string;
}

export default function HomeScreen()
{
    const [Characters, SetCharacters] = useState<Character[]>([]);
    const [Loading, SetLoading] = useState<boolean>(true);
    const [Page, SetPage] = useState<string>("1");

    const FetchCharacters = async (PageNumber : string) =>
    {
        try
        {
            const Response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${PageNumber}`);
            SetCharacters(Response.data.results);
        }catch(error)
        {
            console.error(error);
        }finally
        {
            SetLoading(false);
        }
    }

    useEffect(() =>
    {
        FetchCharacters(Page);
    },[])

    const RenderCharacter = ({item} : {item : Character}) =>
    (
        <View style={styles.card}>
            <Image source={{uri: item.image}} style={styles.image}></Image>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.status}>{item.status}</Text>
            </View>
        </View>
    )

    if(Loading)
    {
        return (
            <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large" color={"#008000"}/>
            </View>
        )
    }

    return (
    <>
        <View style={{flex:1}}>
            <View style={styles.inputContainer}>
                <Text>{Page}/42</Text>
                <TextInput
                    style={styles.input}
                    value={Page}
                    onChangeText={(text) => {SetPage(text)}}
                    keyboardType='numeric'
                />
                <Button title='Buscar' onPress={() => {FetchCharacters(Page)}}/>
            </View>
            <FlatList
                data={Characters}
                keyExtractor={(item) => (item.id.toString())}
                renderItem={RenderCharacter}
                contentContainerStyle={styles.list}
            />
        </View>
    </>
    );
}

const styles = StyleSheet.create(
{
    card:
    {
        flexDirection: "row",
        backgroundColor: "#f0f0f0",
        marginBottom: 12,
        borderRadius: 8,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
    },
    image:
    {
        width: 100,
        height: 100,
    },
    info:
    {
        flex: 1,
        padding: 12,
        justifyContent: "center",
    },
    name:
    {
        fontSize: 16,
        fontWeight: "bold",
    },
    status:
    {
        fontSize: 40,
        color: "#c0c0c0"
    },
    inputContainer:
    {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f0f0f0",
    },
    input:
    {
        flex: 1,
        height: 40,
        borderColor: "#c0c0c0",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginHorizontal: 8,
    },
    list:
    {
        padding: 16,
    },
});