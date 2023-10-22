import './App.css';
import Layout from './Layout';
import CreatePost from './Pages/CreatePost';
import IndexPage from './Pages/IndexPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import Header from './header';
import Post from './post';
import Post2 from './post2';
import {Routes,Route} from "react-router-dom"
 //install react dom router by using command npm install react-router-dom@6.6.1
function App() {
  return (
    <UserContextProvider>
       <Routes>
      <Route path="/" element={ <Layout/>  }>
      <Route index element={<IndexPage/>  }/>
      <Route path={'/login'} element={<LoginPage/>}/>
      <Route path={'/register'} element={ <RegisterPage/>}/>
      <Route path={'/create'} element={ <CreatePost/> }/>
      </Route>      
    </Routes>
    </UserContextProvider>
   
   
  );
}
export default App;