import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import {Provider} from 'react-redux';
import store from './redux/Store';

const theme = createMuiTheme({
  typography: {
    fontFamily: "Iceland"
  }
});
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorker.unregister();
