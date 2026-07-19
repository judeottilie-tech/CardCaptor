import { Route, Routes } from 'react-router-dom'
import AuthorizedRoute from './auth/AuthorizedRoute'
import Login from './auth/Login'
import Register from './auth/Register'
import BinderPageList from './binderpages/BinderPageList'
import BinderPageDetail from './binderpages/BinderPageDetail'
import CreateBinderPage from './binderpages/CreateBinderPage'

export default function ApplicationViews() {
  return (
    <Routes>
      <Route
        index
        element={
          <AuthorizedRoute>
            <BinderPageList />
          </AuthorizedRoute>
        }
      />
      <Route
        path="binderpages/create"
        element={
          <AuthorizedRoute>
            <CreateBinderPage />
          </AuthorizedRoute>
        }
      />
      <Route
        path="binderpages/:id"
        element={
          <AuthorizedRoute>
            <BinderPageDetail />
          </AuthorizedRoute>
        }
      />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  )
}
