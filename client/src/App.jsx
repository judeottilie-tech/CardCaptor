import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import ApplicationViews from './components/ApplicationViews'
import { tryGetLoggedInUser } from './managers/authManager'

function App() {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    const controller = new AbortController();
    tryGetLoggedInUser(controller.signal)
      .then((user) => setLoggedInUser(user))
      .catch((err) => {
        if (err.name !== "AbortError") throw err;
      });
    return () => controller.abort();
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
