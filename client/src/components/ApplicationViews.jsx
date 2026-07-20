import { Route, Routes } from 'react-router-dom'
import { AuthorizedRoute } from './auth/AuthorizedRoute'
import Login from './auth/Login'
import Register from './auth/Register'
import BinderPageList from './binderpages/BinderPageList'
import BinderPageDetail from './binderpages/BinderPageDetail'
import CreateBinderPage from './binderpages/CreateBinderPage'

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
        element={<Login setLoggedInUser={setLoggedInUser} />}
      />
      <Route
        path="register"
        element={<Register setLoggedInUser={setLoggedInUser} />}
      />
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
