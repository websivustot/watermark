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
    Alert
} from 'react-native';

import CameraRoll from "@react-native-community/cameraroll";

import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';
import Jimp from 'jimp';
import RNFS from 'react-native-fs';
import Marker from "react-native-image-marker"


let styles
const { width } = Dimensions.get('window');

const img = require('./p10.png');
const imgProps = Image.resolveAssetSource(img);

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

      async componentDidMount() {
          await request_location_runtime_permission()
        }

    static navigationOptions = {
        title: 'Watermark Logo App'
      }

      state = {
        modalVisible: false,
        photos: [],
        index: null,
        photo: null,
        logo: null,
        image: null,
        saveButtonDisabled: true
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
        }
        )
      }

      editImage = (photo) => {
        console.log(photo);
        this.setState({
          [this.state.image == "photo" ? 'photo' : 'logo']: photo
        });
        console.log("enable",this.state.photo,this.state.logo);
        if ((this.state.photo && this.state.image == "logo") || (this.state.logo && this.state.image == "photo")) {

            this.setState({ saveButtonDisabled: false });
        }
      }

      onComplete = (data) => {
        console.log('data:', data);
      };

  render() {
    console.log('state :', this.state);
    var photo = this.state.photo
      ? this.state.photo
      : 'file///storage/emulated/0/Download/the-lucky-neko-M8uSC8OPXco-unsplash.jpg'
    var logo = this.state.logo
          ? this.state.logo
          : 'file///storage/emulated/0/Download/the-lucky-neko-M8uSC8OPXco-unsplash.jpg'
    console.log('photo: ', photo, 'logo: ', logo);
    return (
      <View style={styles.container}>

        <Image source={{ uri: photo }}
            style={{
                width: width,
                height:400,
                resizeMode: 'contain'
              }}
        />
        <Image source={{ uri: logo }}
                    style={styles.logo}
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
                        //const logo = this.state.logo;
                        //console.log("imgProps: ", imgProps);
                         const logo = this.state.photos[this.state.index].node.image;
                        const logoProps = Image.resolveAssetSource(logo);
                        console.log("logo: ", logo, "logoPropsplus: ", logoProps);

                        //CameraRoll.saveToCameraRoll(logo.uri);

                        this.setState({
                            loading: true
                         })
                         Marker.markText({
                            src: logoProps.uri,
                            text: 'text marker',
                            X: 30,
                            Y: 30,
                            color: '#FF0000',
                            fontName: 'Arial-BoldItalicMT',
                            fontSize: 44,
                            shadowStyle: {
                                dx: 10.5,
                                dy: 20.8,
                                radius: 20.9,
                                color: '#ff00ff'
                            },
                            textBackgroundStyle: {
                                type: 'stretchX',
                                paddingX: 10,
                                paddingY: 10,
                                color: '#0f0'
                            },
                            scale: 1,
                            quality: 100
                         }).then((res) => {
                             this.setState({
                                loading: false,
                                markResult: res
                             })
                            console.log("the path is: "+res);
                            CameraRoll.saveToCameraRoll(res)
                            .then(() => {
                                console.log("img OK")
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

                        //const logo = '/storage/emulated/0/Download/anita-austvika-z_KamnExkgI-unsplash.jpg';
                        const photo = this.state.photo

                        // open a file called "lenna.png"
                        //console.log("logo: "+logo);

                        Jimp.read(imgProps.uri)
                          .then(lenna => {
                            //console.log(lenna);
                            return lenna
                              //.resize(256, 256) // resize
                          })
                          .catch(err => {
                            console.error("something wrong ", err);
                          });

                           /*
                          RNFS.readDir(RNFS.ExternalStorageDirectoryPath + '/Download') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
                            .then((result) => {
                              console.log('GOT RESULT', result);

                              // stat the first file
                              return Promise.all([RNFS.stat(result[0].path), result[0].path]);
                            })
                            .then((statResult) => {
                              if (statResult[0].isFile()) {
                                // if we have a file, read it
                                return RNFS.readFile(statResult[1], 'utf8');
                              }

                              return 'no file';
                            })
                            .then((contents) => {
                              // log the file contents
                              console.log(contents);
                            })
                            .catch((err) => {
                              console.log(err.message, err.code);
                            });
                            */
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
                             this.editImage(this.state.photos[this.state.index].node.image.uri);
                           }
                         }
                   />
                </View>
              )
            }
          </View>
        </Modal>
      </View>
    )
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 10
  },
  buttonContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: width * 0.7

    },
  modalContainer: {
    paddingTop: 20,
    flex: 1
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  openButton: {
    position: 'absolute',
    width,
    padding: 10,
    bottom: 0,
    left: 0
  },
  logo: {
        position: 'absolute',
        width: width / 3,
        height:100,
        resizeMode: 'contain',
        opacity: .5
    }
})

export default App;