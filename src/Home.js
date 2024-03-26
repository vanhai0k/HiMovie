import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,Dimensions
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../API/API";
import {
  GestureHandlerRootView,
  ScrollView
} from "react-native-gesture-handler";
import Swiper from "react-native-swiper";
const { width } = Dimensions.get("window");

const Home = (props) => {
  const [data, setData] = useState([]);
  const [dataTopMovie, setdataTopMovie] = useState([])
  const [reloadData, setReloadData] = React.useState(false);

  const [images, setImages] = useState([
    {
      source: require("../assets/kimbo1.jpg"),
    },
    {
      source:require("../assets/kimbo2.jpg"),
    },
    {
      source:require("../assets/kimbo3.jpg"),
    },
    {
        source:require("../assets/kimbo4.jpg"),
      },
      {
        source:require("../assets/kimbo5.jpg"),
      },
  ]);

  React.useEffect(() => {
    fetchListMovie();
    fetchTopMovie();
  }, [props.navigation, reloadData]);

  const fetchListMovie = async () =>{
    axios
      .get(API.getMovies)
      .then((response) => {
        // Lưu danh sách phim vào state
        setData(response.data);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error fetching movies:", error);
      });
  }

  const fetchTopMovie = async () =>{
    axios.get(API.getTopMovie)
    .then((response) => {
      setdataTopMovie(response.data);
    })
    .catch((error) => {
      console.log("Error fetching top movies:", error);
    })
  }


  const renderIteam = ({ item }) => {

    const infomationMovie = () => {
      props.navigation.navigate('InfoMovie',{
        movieId: item._id,
        namemovie: item.namemovie,
        episodes: item.episodes,
        image: item.image,
        contnet: item.contnet,
        timemovie: item.timemovie,
        episodeNumber: item.episodeNumber,
        categoryname: item.category.name,
        directed: item.directed,
        countView: item.countView,
      });
    }

    return (
      <GestureHandlerRootView>
        <View
          style={{
            width: 124,
            margin: 2,
            height: 200,
            shadowRadius: 20,
            marginBottom: 8,
          }}
        >
          <TouchableOpacity onPress={infomationMovie}>
          <Image
            source={{
              uri: API.getImage + item.image,
            }}
            style={{
              width: "99%",
              height: 200,
              alignSelf: "center",
              marginTop: 3,
              borderRadius: 5,
              position: "absolute",
            }}
          ></Image>
          </TouchableOpacity>
          <View
            style={{
              width: 33,
              height: 33,
              backgroundColor: "red",
              borderRadius: 20,
              alignSelf: "flex-end",
              position: "relative",
              top: "4%",
              right: "5%",
            }}
          >
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                marginTop: 5,
                fontSize: 8,
              }}
            >
              Tập
            </Text>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                fontSize: 9,
              }}
            >
              {item.episodeNumber}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              color: "black",
              textTransform: "capitalize",
              fontWeight: "normal",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {item.namemovie.slice(0, 17)}
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: "gray",
              textTransform: "capitalize",
              fontWeight: "normal",
              fontSize: 10,
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            {/* {item.time} */}
            {item.timemovie} Phút
          </Text>
        </View>
      </GestureHandlerRootView>

    );
  };
  const renderIteamTopMovie = ({ item }) => {

    const infomationMovie = () => {
      props.navigation.navigate('InfoMovie',{
        movieId: item._id,
        namemovie: item.namemovie,
        episodes: item.episodes,
        image: item.image,
        contnet: item.contnet,
        timemovie: item.timemovie,
        episodeNumber: item.episodeNumber,
        categoryname: item.category.name,
        directed: item.directed,
        countView: item.countView,
      });
    }

    return (
      <GestureHandlerRootView>
        <View
          style={{
            width: 124,
            margin: 2,
            height: 200,
            shadowRadius: 20,
            marginBottom: 8,
          }}
        >
          <TouchableOpacity onPress={infomationMovie}>
          <Image
            source={{
              uri: API.getImage + item.image,
            }}
            style={{
              width: "99%",
              height: 200,
              alignSelf: "center",
              marginTop: 3,
              borderRadius: 5,
              position: "absolute",
            }}
          ></Image>
          </TouchableOpacity>
          <View
            style={{
              width: 33,
              height: 33,
              backgroundColor: "red",
              borderRadius: 20,
              alignSelf: "flex-end",
              position: "relative",
              top: "4%",
              right: "5%",
            }}
          >
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                marginTop: 5,
                fontSize: 8,
              }}
            >
              Tập
            </Text>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                fontSize: 9,
              }}
            >
              {item.episodeNumber}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              color: "black",
              textTransform: "capitalize",
              fontWeight: "normal",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {item.namemovie.slice(0, 17)}
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: "gray",
              textTransform: "capitalize",
              fontWeight: "normal",
              fontSize: 10,
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            {/* {item.time} */}
            {item.timemovie} Phút
          </Text>
        </View>
      </GestureHandlerRootView>

    );
  };
  return (
    <GestureHandlerRootView>
    <View>

<View style={{width:'95%',height:110,alignSelf:'center',marginTop:20}}>
        <Swiper
        style={styles.wrapper}
        showsPagination={false}
        autoplay={true}
        loop={true}
        autoplayTimeout={5}
      autoplayDirection={true}
        onIndexChanged={(index) => {
        }}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
          <Image
            key={index}
            style={styles.image}
            source={image.source}
          />
          </View>
        ))}
        </Swiper>
        </View>  

        <ScrollView>
        <View>
          <Text style={{color:'red',fontWeight:'bold',fontSize:18,marginLeft:8,marginTop:8}}>Top Movie</Text>
        <FlatList  horizontal showsHorizontalScrollIndicator={false}
        data={dataTopMovie}
        keyExtractor={(item) => `key-${item._id}`}
        renderItem={renderIteamTopMovie}
        />
        </View>

      <View>
        <Text style={{fontWeight:'bold',fontSize:18,color:'black',marginLeft:8,marginTop:8}}>List Movie</Text>
      <FlatList style={{padding:5,height:350}}
        data={data}
        numColumns={3}
        keyExtractor={(item) => `key-${item._id}`}
        renderItem={renderIteam}
      />
      </View>
        </ScrollView>
    </View>
    </GestureHandlerRootView>
  );

  
};

export default Home;
const styles = StyleSheet.create({
  image: {
    width: '95%', // Đặt chiều rộng cho ảnh (trừ đi margin)
    height: 200, // Đặt chiều cao cho ảnh
    resizeMode: "cover", // Đảm bảo ảnh không bị vỡ hình
    borderRadius: 10, // Bo tròn viền cho ảnh
  },
  wrapper: {},
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
