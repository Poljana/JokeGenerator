import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import DropdownComponent from "./dropdownComponent";

const JokeGenerator = () => {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jokeTypes, setJokeTypes] = useState(['all'])
  const [selectedType, setSelectedType] = useState(null)
  const [generatedJokeSetup, setGeneratedJokeSetup] = useState(null)
  const [generatedJokePunchline, setGeneratedJokePunchline] = useState(null)

  //Gets jokes from the joke api
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

  //Automatically gets all of the joke types available
  useEffect(() => {
    const jokeTypesArr = [...new Set(jokes.map(joke => joke.joke.type))]
    setJokeTypes(prevTypes => [...prevTypes, ...jokeTypesArr])
  }, [jokes])

  const handleJokeTypeChange = (type) => {
    setSelectedType(type)
    console.log("Currently selected joke type - ", type)
  }

  const generateJoke = (type) => {
    let selectedTypeArr = []

    if (selectedType) {
      if (selectedType == "all") {
        selectedTypeArr = jokes
        const randomNum = Math.floor(Math.random() * selectedTypeArr.length)      
        setGeneratedJokeSetup(selectedTypeArr[randomNum].joke.setup)
        setGeneratedJokePunchline(selectedTypeArr[randomNum].joke.punchline)
      } else {
        jokes.map((joke) => (
          joke.joke.type == selectedType ?
          selectedTypeArr.push({
            setup: joke.joke.setup,
            punchline: joke.joke.punchline
          }) :
          null
        ))      
        const randomNum = Math.floor(Math.random() * selectedTypeArr.length)      
        setGeneratedJokeSetup(selectedTypeArr[randomNum].setup)
        setGeneratedJokePunchline(selectedTypeArr[randomNum].punchline)  
      }
    } else {
      console.error("No selected joke type, select a type to generate joke.")
    }    
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Joke Generator</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
        <View style={styles.tableHeader}>
            <Text style={[styles.headerCell]}>Joke Setup</Text>
            <Text style={[styles.headerCell]}>Punchline</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>{generatedJokeSetup}</Text>
          <Text style={styles.cell}>{generatedJokePunchline}</Text>
        </View>
        <DropdownComponent data={jokeTypes} onTypeChange={handleJokeTypeChange} />
        <TouchableOpacity style={styles.generateBtn} onPress={generateJoke}>
          <Text style={{ 
            color: "#fff", 
            width: "100%", 
            textAlign: "center", 
            fontSize: "18px" 
          }}>
            Generate Joke
          </Text>
        </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const primaryColor = "#0d93b8"

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
        fontSize: "18px",
        marginBlock: "3rem"
    },
    headerCell: {
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        flex: 1,
        paddingBlock: "1rem"
    },
    generateBtn: {
      padding: "1rem",
      marginInline: "auto",
      backgroundColor: primaryColor,
      borderRadius: "0.5rem",
      width: "45%",
      display: "flex",
      justifyContent: "center"
    }
})

export default JokeGenerator;
