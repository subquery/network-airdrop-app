import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { RainbowProvider } from 'conf/rainbowConf';

import { AppContextProvider } from 'contextProvider';

import App from './App';
import { QueryApolloProvider } from './containers';

import 'conf/polyfill';
import './index.css';

ReactDOM.render(
  <QueryApolloProvider>
    <RainbowProvider>
      <BrowserRouter>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
    </RainbowProvider>
  </QueryApolloProvider>,
  document.getElementById('root')
);
