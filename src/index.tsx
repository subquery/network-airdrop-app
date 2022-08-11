import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { AppContextProvider } from 'contextProvider';

import App from './App';
import { QueryApolloProvider, Web3Provider } from './containers';
import reportWebVitals from './reportWebVitals';

import './index.css';

ReactDOM.render(
  <QueryApolloProvider>
    <Web3Provider>
      <BrowserRouter>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
    </Web3Provider>
  </QueryApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
