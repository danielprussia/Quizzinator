import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './utils/auth';

import Home from './pages/home';
import NavBar from './components/Nav';
import Login from './pages/login';
import Signup from './pages/signup';
import Study from './pages/study';
import Profile from './pages/profile';
import Leaderboard from './pages/leaderboard';
import Grid from '@mui/material/Unstable_Grid2';


// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const isLoggedIn = Auth.loggedIn()

  return (
    <ApolloProvider client={client}>
      <Router>
        <Grid container direction='column' disableGutters='true'>
          <Grid item>
            {isLoggedIn && <NavBar />}
          </Grid>
          <Grid alignItems="center" justifyContent="center" container>
            <Grid display="auto">
              <img
                style={{ width: "180px", height: "180px", padding: "10px" }}
                src={require("./logo8.PNG")}
                alt="Quizzinator Logo"
              />
            </Grid>
          </Grid>
          <Grid item p={1} sx={{ overflow: 'auto', }}>
            <Routes>
              <Route
                exact path="/"
                element={isLoggedIn ? <Home /> : <Login />}
              />
              <Route
                path="/Signup"
                element={<Signup />}
              />
              <Route
                path="/Study"
                element={<Study />}
              />
              <Route
                path="/Leaderboard"
                element={<Leaderboard />}
              />
              <Route
                path="/Profile"
                element={<Profile />}
              />
            </Routes>
          </Grid>
        </Grid>
      </Router>
    </ApolloProvider>
  );
}

export default App;
