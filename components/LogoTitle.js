import React from 'react';
import { Image,
            View,
            Text
 } from 'react-native';

export default class LogoTitle extends React.Component {
  render() {
    return (
    <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
      <Image
        source={require('../stamp.png')}
        style={{ width: 30, height: 30 }}
      />
      <Text style={{fontSize: 22, color: '#9c9c9c', paddingLeft: 5 }}>Watermark Logo App</Text>
     </View>
    );
  }
}