/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
  PanResponder,
  Animated
} from 'react-native';

import CameraRoll from "@react-native-community/cameraroll";

import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
import Marker from 'react-native-image-marker';
import LogoTitle from './components/LogoTitle';
import P10 from './p10.png';

let styles
const { width, height } = Dimensions.get('window');

export async function request_location_runtime_permission() {

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'ReactNativeCode Storage Permission',
        'message': 'ReactNativeCode App needs access to your storage '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //Alert.alert("Storage Permission Granted.");
    }
    else {
      Alert.alert("Storage Permission Not Granted");
    }
  } catch (err) {
    console.warn(err)
  }
}

class App extends React.Component {

      constructor() {
          super();
      }

      async componentDidMount() {
          await request_location_runtime_permission()
        }

      static navigationOptions = {
        // headerTitle instead of title
            headerTitle: () => <LogoTitle />,
      }

      state = {
        modalVisible: false,
        photos: [],
        index: null,
        photo: null,
        logo: null,
        image: null,
        saveButtonDisabled: true,
        width: width,
        height: height,
        logoTop: 0,
        logoLeft: 0,
        rate: 1,
        pan: new Animated.ValueXY()
      }

      UNSAFE_componentWillMount() {
          // Add a listener for the delta value change
          this._val = { x:0, y:0 }
          this.state.pan.addListener((value) => this._val = value);
          // Initialize PanResponder with move handling
          this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
            onPanResponderMove: (e, gesture) => {
                //console.log("gesture: ", this.state.pan.x, this.state.pan.y);

                Animated.event([
                          null, { dx: this.state.pan.x, dy: this.state.pan.y }
                        ])(e, gesture)
            },
            onPanResponderStart: (e, gesture) => {console.log("start",this.state.pan.y, this.state.pan.x)},
            onPanResponderEnd: (e, gesture) => {console.log("end")},
            onPanResponderRelease: (e, gesture) => {console.log("release",this.state.pan.y, this.state.pan.x)
            this.setState({ logoTop: this.state.pan.y._value + this.state.logoTop, logoLeft: this.state.pan.x._value + this.state.logoLeft })
            this.state.pan.setValue({ x:0, y:0})
            },
            onPanResponderTerminate: (e, gesture) => {console.log("terminate")}
          });
          // adjusting delta value
          this.state.pan.setValue({ x:0, y:0})
        }



      setIndex = (index) => {
        if (index === this.state.index) {
          index = null
        }
        this.setState({ index })
      }

      getPhotos = (image = "photo") => {
        CameraRoll.getPhotos({
          first: 20,
          assetType: 'Photos'
        })
        .then(r => this.setState({ photos: r.edges, image: image }))
      }

      toggleModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
      }

      navigate = () => {
        const { navigate } = this.props.navigation
        navigate('SaveImage', {
         logo: this.state.logo,
         photo: this.state.photo,
        })
      }

      share = () => {
        const image = this.state.photos[this.state.index].node.image.uri
        RNFetchBlob.fs.readFile(image, 'base64')
        .then((data) => {
        //console.log("image is", data);
          let shareOptions = {
            title: "React Native Share Example",
            message: "Check out this photo!",
            url: `data:image/jpg;base64,${data}`,
            subject: "Check out this photo!"
          }

          Share.open(shareOptions)
            .then((res) => console.log('res:', res))
            .catch(err => console.log('err', err))
        })
      }

      editImage = (photo) => {
        console.log(photo);
        this.setState({
          [this.state.image == "photo" ? 'photo' : 'logo']: photo
        });

        console.log("enable",this.state.photo,this.state.logo);
        if ((this.state.photo && this.state.image == "logo") || (this.state.logo && this.state.image == "photo")) {

            this.setState({ saveButtonDisabled: false
                            });

        }

        if (this.state.photo && this.state.logo) {

                    const rate = this.state.photo.width / this.state.logo.width
                    this.setState({
                                    logoTop: this.state.photo.height / 10,
                                    logoLeft: this.state.photo.width / 10,
                                    rate: rate
                                  });

            }
      }

      onComplete = (data) => {
        console.log('data:', data);
      };



  render() {
    console.log('state :', this.state);
    const tempImg = Image.resolveAssetSource(P10);
    console.log("tempimage", tempImg);
    var photo = this.state.photo
      ? this.state.photo
      : {"filename": "p10.png", "height": 10, "uri": tempImg.uri, "width": 10}
    var logo = this.state.logo
          ? this.state.logo
          : {"filename": "p10.png", "height": 10, "uri": tempImg.uri, "width": 10}
    console.log('photo: ', photo, 'logo: ', logo);
    const panStyle = {
          transform: this.state.pan.getTranslateTransform()
     }

    return (

        <ScrollView contentContainerStyle={styles.scrollView1}>
        <View style={styles.container}>
        <Image source={{ uri: photo.uri }}
            style={{
                width: width,
                height:this.state.photo ? this.state.photo.height / (this.state.photo.width / width) : width,
                resizeMode: 'contain'
              }}
        />
        <Animated.Image source={{ uri: logo.uri }}

                 {...this.panResponder.panHandlers}
               style={[panStyle, {
                                    position: 'absolute',
                                    width: this.state.width / 3,
                                    height:100,
                                    resizeMode: 'contain',
                                    opacity: 1,
                                    top: this.state.logoTop,
                                    left: this.state.logoLeft
                                    }]}
                />

        <View style={styles.buttonContainer}>
        <Button
          title='Open Photo'
          onPress={() =>
            {
                this.toggleModal();
                this.getPhotos();

             }
            }
        />
        <Button
              title='Open Logo'
              style={styles.button}
              onPress={() =>
                {
                    this.toggleModal();
                    this.getPhotos("logo");
                 }
                }
            />
        <Button
                      title='Save'
                      style={{ disabled: true }}
                      disabled={this.state.saveButtonDisabled ? true : false}
                      onPress={() => {
                        const logo = this.state.logo;
                        const photo = this.state.photo;
                        const rate = photo.width / logo.width;
                        console.log("photo.width / logo.width,rate: ", rate, photo.width, logo.width);

                        this.setState({
                            loading: true
                         })

                         const markerX = this.state.photo.width / this.state.width * this.state.logoLeft;
                         const markerY = this.state.photo.width / this.state.width * this.state.logoTop;
                         const markerScale = rate * 0.3;
                         console.log("markerX,markerY,markerScale",markerX,markerY,markerScale)


                         Marker.markImage({
                            src: photo.uri,
                            markerSrc: logo.uri, // icon uri
                            X: markerX, // left
                            Y: markerY, // top
                            scale: 1, // scale of bg
                            markerScale: markerScale, // scale of icon
                            quality: 100, // quality of image
                            saveFormat: 'jpg',
                            maxSize: 10000,
                         }).then((res) => {
                             this.setState({
                                loading: false,
                                markResult: res
                             })
                            console.log("the path is: "+res);
                            CameraRoll.saveToCameraRoll(res)
                            .then(() => {
                                console.log("img OK");
                                Alert.alert(
                                  'Image saved to Gallery'
                                );

                            })
                            .catch((err) => {
                                console.log("img error:", err)
                            });
                         }).catch((err) => {
                            console.log(err)
                            this.setState({
                                loading: false,
                                err
                            })
                         })

                        }
                      }
                    />
         </View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => console.log('closed')}
        >
          <View style={styles.modalContainer}>
            <Button
              title='Close'
              onPress={this.toggleModal}
            />
            <ScrollView
              contentContainerStyle={styles.scrollView}>
              {
                this.state.photos.map((p, i) => {
                  return (
                    <TouchableHighlight
                      style={{opacity: i === this.state.index ? 0.5 : 1}}
                      key={i}
                      underlayColor='transparent'
                      onPress={() => this.setIndex(i)}
                    >
                      <Image
                        style={{
                          width: width/3,
                          height: width/3
                        }}
                        source={{uri: p.node.image.uri}}
                      />
                    </TouchableHighlight>
                  )
                })
              }
            </ScrollView>
            {
              this.state.index !== null  && (
                <View style={styles.openButton}>
                  <Button
                     title='Open'
                     onPress={() =>
                         {
                             this.toggleModal();
                             this.editImage(this.state.photos[this.state.index].node.image);
                           }
                         }
                   />
                </View>
              )
            }
          </View>
        </Modal>

      </View>
       </ScrollView>
    )
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 25
  },
  buttonContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: width * 0.7,
      paddingTop:20

    },
  modalContainer: {
    paddingTop: 20,
    flex: 1
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  scrollView1: {
      

    },
  openButton: {
    position: 'absolute',
    width,
    padding: 10,
    bottom: 0,
    left: 0
  },
  logo: {
     //width: this.state.width / 3,
     height:100,
     resizeMode: 'contain',
     opacity: 1
  }
})

export default App;