import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import ApplicationViews from './components/ApplicationViews'
import { tryGetLoggedInUser } from './managers/authManager'

function App() {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    tryGetLoggedInUser().then((user) => {
      setLoggedInUser(user);
    });
  }, []);

  if (loggedInUser === undefined) {
    return ("Loading...");
  }

  return (
    <>
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <ApplicationViews
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
    </>
  );
}

export default App;
