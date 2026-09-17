import { Route, Routes } from 'react-router-dom'
import { AuthorizedRoute } from './auth/AuthorizedRoute'
import { GuestRoute } from './auth/GuestRoute'
import Login from './auth/Login'
import Register from './auth/Register'
import BinderPageList from './binderpages/BinderPageList'
import BinderPageDetail from './binderpages/BinderPageDetail'
import CreateBinderPage from './binderpages/CreateBinderPage'
import PublicProfile from './profile/PublicProfile'
import PublicBinderPageView from './profile/PublicBinderPageView'

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route
        index
        element={
          <AuthorizedRoute
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          >
            <BinderPageList />
          </AuthorizedRoute>
        }
      />
      <Route
        path="binderpages/create"
        element={
          <AuthorizedRoute
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          >
            <CreateBinderPage />
          </AuthorizedRoute>
        }
      />
      <Route
        path="binderpages/:id"
        element={
          <AuthorizedRoute
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          >
            <BinderPageDetail />
          </AuthorizedRoute>
        }
      />
      <Route
        path="login"
        element={
          <GuestRoute loggedInUser={loggedInUser}>
            <Login setLoggedInUser={setLoggedInUser} />
          </GuestRoute>
        }
      />
      <Route
        path="register"
        element={
          <GuestRoute loggedInUser={loggedInUser}>
            <Register setLoggedInUser={setLoggedInUser} />
          </GuestRoute>
        }
      />
      <Route path="u/:userName" element={<PublicProfile />} />
      <Route path="u/:userName/:id" element={<PublicBinderPageView />} />
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
