import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";

const distanceHorizontal = 20;
const distanceBetweenItem = 22;
const apiUrl = "https://random-data-api.com/api/users/random_user?size=10";

export default function App() {
  const windowWidth = Dimensions.get("window").width;
  const sizeItem =
    (windowWidth - distanceHorizontal * 4 - distanceBetweenItem) / 2;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginTop: StatusBar.currentHeight,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    btnFetch: {
      backgroundColor: "red",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      marginBottom: 20,
    },
    txtBtnFetch: {
      fontWeight: "bold",
      fontSize: 18,
      color: "white",
    },
    viewData: {
      backgroundColor: "#A5DF00",
      width: "100%",
      height: "100%",
      paddingVertical: 20,
      marginBottom: 30,
      flex: 1,
    },
    btnItem: {
      borderRadius: 9,
      width: sizeItem,
      height: sizeItem,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      marginBottom: 20,
    },
    imgItem: {
      width: 50,
      height: 50,
    },
    contentContainerStyleFll: {
      alignItems: "center",
    },
    columnWrapper: {
      paddingHorizontal: distanceBetweenItem,
    },
  });
  const [listDataRandom, setListDataRandom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleFetchRandom = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl);
      const data = response?.data;
      console.log("response", response);
      setLoading(false);
      setListDataRandom(data);
      return data;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      return null;
    }
  };
  const handleShowMoreInfo = (itemId) => {
    setSelectedItemId(itemId === selectedItemId ? null : itemId);
  };
  const CustomItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.btnItem, { marginRight: index % 2 === 0 ? 20 : 0 }]}
        onPress={() => handleShowMoreInfo(item?.id)}
      >
        <Image
          source={{
            uri: item?.avatar,
          }}
          style={styles.imgItem}
        />
        {selectedItemId === item?.id ? (
          <>
            <Text>{`${item?.first_name} ${item?.last_name}`}</Text>
            <Text>{item?.date_of_birth}</Text>
          </>
        ) : null}
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnFetch}
        onPress={() => handleFetchRandom()}
      >
        <Text style={styles.txtBtnFetch}>Fetch Random</Text>
      </TouchableOpacity>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={"red"} />
        </View>
      ) : listDataRandom && listDataRandom?.length > 0 ? (
        <View style={styles.viewData}>
          <FlatList
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.contentContainerStyleFll}
            data={listDataRandom}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return <CustomItem index={index} item={item} />;
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
