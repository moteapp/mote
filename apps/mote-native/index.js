// monkey patching for url and url-search-params
import 'core-js/actual/url';
import 'core-js/actual/url-search-params';

import {AppRegistry} from 'react-native';
import App from './src/workbench/screen/workbench';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
