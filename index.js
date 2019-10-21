/**
 * @format
 */

import {AppRegistry, YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ImageBrowser from './ImageBrowser';
import SaveImage from './SaveImage';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Navigation = createStackNavigator ({
  App: { screen: App },
  ImageBrowser: { screen: ImageBrowser },
  SaveImage: { screen: SaveImage }
});

// ignore specific yellowbox warnings
YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);

AppRegistry.registerComponent(appName, () => createAppContainer(Navigation));
