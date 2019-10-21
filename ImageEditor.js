import React from 'react';

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
} from 'react-native';

class ImageEditor extends React.Component {

render() {

    return (
      <View style={{flex: 1}}>
        <Text style={styles.title}>Editing Image</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>


                  <Image
                    style={styles.image}
                    source={{ uri: 'file:///storage/emulated/0/Download/the-lucky-neko-M8uSC8OPXco-unsplash.jpg' }}
                  />


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
})

export default ImageEditor;
