import './App.css';
import Layout from './Layout';
import CreatePost from './Pages/CreatePost';
import EditPost from './Pages/EditPost';
import IndexPage from './Pages/IndexPage';
import LoginPage from './Pages/LoginPage';
import PostPage from './Pages/PostPage';
import RegisterPage from './Pages/RegisterPage';
import ProfilePage from './Pages/ProfilePage';
import ProfileEditPage from './Pages/ProfileEditPage';
import { UserContextProvider } from './UserContext';
import { SearchProvider } from './SearchContext'; // Import SearchProvider
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <UserContextProvider>
      <SearchProvider> {/* Wrap your routes with SearchProvider */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path={'/login'} element={<LoginPage />} />
            <Route path={'/register'} element={<RegisterPage />} />
            <Route path={'/create'} element={<CreatePost />} />
            <Route path={'/post/:id'} element={<PostPage />} />
            <Route path={'/edit/:id'} element={<EditPost />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile/:id/edit" element={<ProfileEditPage />} />
          </Route>
        </Routes>
      </SearchProvider>
    </UserContextProvider>
  );
}

export default App;
