import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  TouchableHighlight,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { API } from "../API/API";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const InfoMovie = ({ route, navigation }) => {
  const {
    namemovie,
    episodes,
    image,
    contnet,
    timemovie,
    episodeNumber,
    directed,
    categoryname,
    countView,
    movieId,
  } = route.params;
  const [dataComment, setdataComment] = useState([])

  // Sắp xếp mảng episodes theo thứ tự giảm dần của episodeName
  episodes.sort((a, b) => b.idEpisodes.episodeName - a.idEpisodes.episodeName);
  // Chọn hai phần tử đầu tiên từ mảng đã sắp xếp
  const topTwoEpisodes = episodes.slice(0, 3);

  const episodeMovie = episodes.slice();

  const watchMovie = async (_id) => {
    try {
      const response = await axios.post(API.postView + _id);
      console.log("log:" + response.data.message);
    } catch (error) {
      console.log("Fail: " + error.message);
    }
  };
  const handlBack = () => {
    navigation.navigate("Bottomnaviga");
    // navigation.goBack();
  };

  const handleEpisodePress = async (
    episodeName,
    videoLink,
    countMovie,
    _id
  ) => {
    // Chuyển màn hình và truyền dữ liệu

    try {
      await AsyncStorage.setItem("namemovie", namemovie);
      await AsyncStorage.setItem("directed", directed);
      await AsyncStorage.setItem("image", image);
      console.log("Name saved successfully!:" + image);
    } catch (error) {
      console.log(error.message);
    }
    watchMovie(_id);
    navigation.navigate("StartVideo", {
      episodeName,
      videoLink,
      episodes,
      countMovie,movieId,
      _id // Thêm _id vào đây để gửi qua
    });
  };

  useEffect(() =>{
    const fetchComments = async () =>{

      try {
        const response = await axios.get(API.getComment + movieId);
      setdataComment(response.data);
      }
       catch (error) {
        console.log(error);
      }
    }

    fetchComments();
  },[]);

  const renderComment = ({item}) =>{
    return(
      <View style={styles.itemcomment}>
        <Text style={{color:'black',fontWeight:'bold',fontSize:17}}>
            {item.user_id.name}
        </Text>
        <Text style={{color:'white'}}>
            {item.content}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ position: "relative", width: "100%", height: 200 }}>
        <ImageBackground
          source={{ uri: API.getImage + image }} // Ảnh đầu tiên
          style={{
            width: "100%",
            height: 280,
            borderRadius: 5,
            resizeMode: "cover",
          }}
        >
          <View style={styles.domo} />
        </ImageBackground>
        <ImageBackground
          source={{ uri: API.getImage + image }} // Ảnh thứ hai
          style={styles.anhbia}
        >
          <Text style={styles.theodoi}>+ Theo dõi</Text>

          <View style={{ top: "52%" }}>
            <TouchableOpacity
              onPress={() =>
                handleEpisodePress(
                  episodeMovie[0].idEpisodes.episodeName,
                  episodeMovie[0].idEpisodes.video,
                  episodeMovie[0].idEpisodes.countMovie
                )
              }
            >
              <Text style={styles.xemphim}>Xem ngay</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>


        <View style={styles.noidung}>
        <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 25,
              height: 25,
              alignItems: "flex-end",
              backgroundColor: "red",
            }}
            onPress={handlBack}
          >
            <Image
              source={require("../assets/cross.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
          <Text style={{ color: "#eab208", fontSize: 18 }}> {namemovie} </Text>
          <ScrollView style={{ maxHeight: 160 }}>
            <Text style={{ color: "#c6c6c7", fontSize: 14 }}>{contnet}</Text>
          </ScrollView>

        </View>
      </View>
      <View
        style={{
          backgroundColor: "white",
          height: 1,
          marginLeft: 17,
          marginRight: 17,
          marginTop: "10%",
        }}
      ></View>

      <View
        style={{ flexDirection: "row", alignSelf: "center", marginTop: "3%" }}
      >
        <Image
          style={{ width: 17, height: 17 }}
          source={require("../assets/clock.png")}
        />
        <Text style={{ color: "white", marginLeft: 6 }}>{timemovie} phút</Text>
        <Image
          style={{ width: 17, height: 17, marginLeft: 40 }}
          source={require("../assets/calendar.png")}
        />
        <Text style={{ color: "white", marginLeft: 6 }}>2024</Text>
        <Image
          style={{ width: 17, height: 17, marginLeft: 40 }}
          source={require("../assets/view.png")}
        />
        <Text style={{ color: "white", marginLeft: 6 }}>
          {countView} lượt xem
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: "5%" }}>
        <Image
          style={{ width: 20, height: 20, marginLeft: 15 }}
          source={require("../assets/personaldata.png")}
        />
        <Text
          style={{
            marginLeft: 6,
            color: "#ffc107",
            fontWeight: "bold",
            fontSize: 17,
          }}
        >
          Thông tin phim
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#ffc107",
          height: 4,
          marginLeft: 17,
          marginTop: "4%",
          width: 140,
        }}
      ></View>
      <View
        style={{
          backgroundColor: "rgb(101,99,99)",
          height: "auto",
          marginLeft: 10,
          marginRight: 10,
          flexDirection: "row",
          padding: 8,
        }}
      >
        <View style={{ width: "50%", flexDirection: "column" }}>
          <View style={{ flexDirection: "row", padding: 3 }}>
            <Image
              style={{ width: 17, height: 17, marginLeft: 8 }}
              source={require("../assets/coin.png")}
            />
            <Text style={{ color: "white", marginLeft: 6 }}>
              Trạng thái:
              <Text style={{ color: "#ffc107" }}> {episodeNumber} Tập</Text>
            </Text>
          </View>
          <View style={{ flexDirection: "row", padding: 3, width: 176 }}>
            <Image
              style={{ width: 17, height: 17, marginLeft: 8 }}
              source={require("../assets/coin.png")}
            />
            <Text style={{ color: "white", marginLeft: 6 }}>
              Thể loại:
              <Text style={{ color: "#ffc107" }}> {categoryname}</Text>{" "}
            </Text>
          </View>
          <View style={{ flexDirection: "row", padding: 3 }}>
            <Image
              style={{ width: 17, height: 17, marginLeft: 8 }}
              source={require("../assets/coin.png")}
            />
            <Text style={{ color: "white", marginLeft: 6 }}>
              Số người theo dõi:{" "}
            </Text>
          </View>
          <View style={{ flexDirection: "row", padding: 3 }}>
            <Image
              style={{ width: 17, height: 17, marginLeft: 8 }}
              source={require("../assets/coin.png")}
            />
            <Text style={{ color: "white", marginLeft: 6 }}>
              Quốc gia:
              <Text style={{ color: "#ffc107" }}>Việt Nam</Text>
            </Text>
          </View>
          <View style={{ flexDirection: "row", padding: 3 }}>
            <Image
              style={{ width: 17, height: 17, marginLeft: 8 }}
              source={require("../assets/coin.png")}
            />
            <Text style={{ color: "white", marginLeft: 6 }}>
              Nhà sản xuất:
              <Text style={{ color: "#ffc107" }}> {directed}</Text>
            </Text>
          </View>
        </View>
        <View style={{ width: "50%", flexDirection: "column" }}>
          <View style={{ flexDirection: "row", padding: 3 }}>
            <Image
              style={{ width: 17, height: 17, marginLeft: 8 }}
              source={require("../assets/coin.png")}
            />
            <Text style={{ color: "white", marginLeft: 6 }}>
              Thời lượng:
              <Text style={{ color: "#ffc107" }}> {timemovie} phút</Text>
            </Text>
          </View>
          <View style={{ flexDirection: "row", padding: 3 }}>
            <Image
              style={{ width: 17, height: 17, marginLeft: 8 }}
              source={require("../assets/coin.png")}
            />
            <Text style={{ color: "white", marginLeft: 6 }}>
              Độ phân giải: HD
            </Text>
          </View>
          <View style={{ flexDirection: "row", padding: 3 }}>
            <Image
              style={{ width: 17, height: 17, marginLeft: 8 }}
              source={require("../assets/coin.png")}
            />
            <Text style={{ color: "white", marginLeft: 6 }}>Chú ý: None</Text>
          </View>
          <View style={{ flexDirection: "row", padding: 3 }}>
            <Image
              style={{ width: 17, height: 17, marginLeft: 8 }}
              source={require("../assets/coin.png")}
            />
            <Text style={{ color: "white", marginLeft: 6 }}>
              Tập mới:
              <View style={{ flexDirection: "row" }}>
                {topTwoEpisodes.map((episode, index) => (
                  <View
                    key={index}
                    style={{
                      marginRight: 5,
                      backgroundColor: episode.idEpisodes.statusEpisode === 0 ? '#4c4c4c' : 'red', // Màu nền là '#4c4c4c' nếu statusEpisode là 0, ngược lại là màu đỏ
                      borderRadius: 4,
                      width: 20,
                      paddingLeft: 3,
                      marginLeft: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        handleEpisodePress(
                          episode.idEpisodes.episodeName,
                          episode.idEpisodes.video,
                          episode.idEpisodes.countMovie,
                          episode.idEpisodes._id
                        )
                      }
                      disabled={episode.idEpisodes.statusEpisode === 1} // Ngăn chặn chuyển trang nếu statusEpisode là 1

                    >
                      <Text style={{ color: "white" }}>
                        {" "}
                        {episode.idEpisodes.episodeName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Text style={{ color: "white" , fontSize:18,marginLeft:8,marginTop:14}}>Bình luận</Text>

        <ScrollView style={{height:300}}>
        <FlatList 
        data={dataComment}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderComment}
        />
        </ScrollView>
      </View>
    </View>
  );
};

export default InfoMovie;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1416",
  },
  theodoi: {
    color: "white",
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
    marginLeft: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 60,
    padding: 5,
    borderRadius: 3,
  },
  anhbia: {
    width: 120,
    height: 160,
    alignSelf: "center",
    borderRadius: 10,
    position: "absolute",
    resizeMode: "cover",
    top: "25%",
    left: "4%",
  },
  noidung: {
    width: "56%",
    height: 180,
    alignSelf: "center",
    borderRadius: 10,
    position: "absolute",
    resizeMode: "cover",
    top: "15%",
    right: "4%",
    flexDirection: "column",
  },
  domo: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu đen với độ mờ 50%
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  xemphim: {
    backgroundColor: "rgb(224,74,74)",
    color: "white",
    top: "57%",
    textAlign: "center",
  },
  itemcomment:{
    backgroundColor:'gray',
    padding:10,
    marginBottom:8,
    marginLeft:8,marginRight:8,
    borderTopRightRadius:10,
  }
});
