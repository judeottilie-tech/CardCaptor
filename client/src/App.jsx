import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import ApplicationViews from './components/ApplicationViews'
import { tryGetLoggedInUser } from './managers/authManager'
import CursorTrail from './components/decor/cursorTrail'
import Pet from './components/decor/Pet'

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
      <CursorTrail />
      {loggedInUser && <Pet />}
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <ApplicationViews
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
    </>
  );
}

export default App;
