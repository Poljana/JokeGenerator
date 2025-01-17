import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import DropdownComponent from "./dropdownComponent";

const JokeGenerator = () => {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jokeTypes, setJokeTypes] = useState([])

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/15Dkatz/official_joke_api/refs/heads/master/jokes/index.json"
        );
        const result = await response.json()
        setJokes(result.map((joke) => ({
            joke: {
              type: joke.type,
              setup: joke.setup,
              punchline: joke.punchline
            }
        })))
      } catch (error) {
        console.log("Error fetching weather data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJokes();
  }, []);



  //  NE RADI, TRIBA POPRAVITI ASAP !!!!!!!!!!!!!!!!!!!!!!

  useEffect(() => {
    const filterJokeTypes = (jokes) => {
      return [...new Set(jokes.map(joke => joke.joke.type))]
    }
    const jokeTypesArr = filterJokeTypes(jokes)
    setJokeTypes(jokeTypesArr.map((type, index) => ({
      type: jokeTypesArr[index].toString()
    })))
  }, [])

  console.log(jokeTypes)

  const renderItem = ({item}) => (
    <View style={styles.row}>
        <Text style={styles.cell}>{item.joke.setup}</Text>
        <Text style={styles.cell}>{item.joke.punchline}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Jokes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
        <View style={styles.tableHeader}>
            <Text style={[styles.headerCell]}>Joke Setup</Text>
            <Text style={[styles.headerCell]}>Punchline</Text>
        </View>
        {/* <DropdownComponent data={jokeTypes} /> */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff"
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 5,
        marginBottom: 5
    },
    row: {
        flexDirection: "row",        
    },
    cell: {
        flex: 1,
        textAlign: "center",
        marginBottom: "1rem"
    },
    headerCell: {
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        flex: 1,
        paddingBlock: "1rem"
    }
})

export default JokeGenerator;
