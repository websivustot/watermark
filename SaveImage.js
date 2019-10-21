import React from 'react'

import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  CameraRoll,
  TouchableHighlight,
  Platform,
  Alert
} from 'react-native'

import RNFetchBlob from 'react-native-fetch-blob'



const { width, height } = Dimensions.get('window')
let styles
class SaveImage extends React.Component {
  static navigationOptions = {
    title: 'Save Image',
  }

  state = {
    images: [],
    loading: true,
    page: 1
  }



  componentDidMount() {

  }

  saveToCameraRoll = (image) => {
    if (Platform.OS === 'android') {
      RNFetchBlob
      .config({
        fileCache : true,
        appendExt : 'jpg'
      })
      .fetch('GET', image.urls.small)
      .then((res) => {
        CameraRoll.saveToCameraRoll(res.path())
          .then(Alert.alert('Success', 'Photo added to camera roll!'))
          .catch(err => console.log('err:', err))
      })
    } else {
      CameraRoll.saveToCameraRoll(image.urls.small)
        .then(Alert.alert('Success', 'Photo added to camera roll!'))
    }
  }

  render() {
  const { navigation } = this.props;

  var logo = JSON.stringify(navigation.getParam('logo', 'NO-LOGO'));
  var photo = JSON.stringify(navigation.getParam('photo', 'NO-LOGO'));

   /*this.magician.addWaterMark({
     cover: photo,
     mode: "image",
     waterMark: logo,
     width: 60,
     height: 60,
     opacity: 0.8,
     coordinate: [330, 300]
   });*/

    return (
      <View style={{flex: 1}}>
        <Text style={styles.title}>Save Image</Text>
        <Text>
          logo: {logo}
          photo: {photo}
        </Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>

        </ScrollView>
      </View>
    )
  }
}

styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  centerLoader: {
    height: height - 100,
    width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: width / 2, height: width / 2
  },
  title: {
    textAlign: 'center',
    padding: 20
  }
})

export default SaveImage;