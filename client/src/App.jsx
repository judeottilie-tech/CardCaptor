import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import ApplicationViews from './components/ApplicationViews'
import { tryGetLoggedInUser } from './managers/authManager'
import { getPet } from './managers/petManager'
import CursorTrail from './components/decor/cursorTrail'
import Pet from './components/decor/Pet'

function App() {
  const [loggedInUser, setLoggedInUser] = useState();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    tryGetLoggedInUser(controller.signal)
      .then((user) => setLoggedInUser(user))
      .catch((err) => {
        if (err.name !== "AbortError") throw err;
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!loggedInUser) {
      setPet(null);
      return;
    }
    const controller = new AbortController();
    getPet(controller.signal)
      .then(setPet)
      .catch((err) => {
        if (err.name !== "AbortError") throw err;
      });
    return () => controller.abort();
  }, [loggedInUser]);

  if (loggedInUser === undefined) {
    return ("Loading...");
  }

  return (
    <>
      <CursorTrail />
      {loggedInUser && <Pet pet={pet} setPet={setPet} />}
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} pet={pet} />
      <ApplicationViews
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
    </>
  );
}

export default App;
