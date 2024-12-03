import { Image, StyleSheet, Platform, View, Text, FlatList, ActivityIndicator, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Pokemon
{
    id: number;
    name: string;
    height: number;
    weigth: number;
    sprites: {front_default: string, front_shiny: string}
}

const PageSize = 20

export default function HomeScreen()
{
    const [Pokemon, SetPokemon] = useState<Pokemon[]>([]);
    const [Loading, SetLoading] = useState<boolean>(true);
    const [Page, SetPage] = useState<string>("1");

    const FetchPokemon = async (PageNumber : string) =>
    {
        try
        {
            const Response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${PageSize}&offset=${PageSize * (Number.parseInt(Page) - 1)}`);
            const Results = Response.data.results;
            let Pkmn : Pokemon[] = []
            Results.forEach((item : {url: string}) =>
            {
                axios.get(item.url)
                .then((Response) =>
                {
                    Pkmn.push(Response.data);
                    Pkmn.sort((a : Pokemon, b : Pokemon) => (a.id - b.id))
                })
            });
            SetPokemon(Pkmn);
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
        FetchPokemon(Page);
    },[])

    const RenderCharacter = ({item} : {item : Pokemon}) =>
    (
        <View style={styles.card}>
            <Image source={{uri: Math.floor(Math.random() * 8192) == 0 ? item.sprites.front_shiny : item.sprites.front_default}} style={styles.image}></Image>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
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
                <Button title='Buscar' onPress={() => {FetchPokemon(Page)}}/>
            </View>
            <FlatList
                data={Pokemon}
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