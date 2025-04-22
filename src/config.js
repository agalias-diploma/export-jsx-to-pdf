const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  wsUrl: process.env.REACT_APP_WS_URL,
  isSecure: process.env.REACT_APP_API_URL?.startsWith('https'),
  clientId: process.env.REACT_APP_CLIENT_ID,
};

export default config;
