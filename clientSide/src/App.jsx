import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import Signin from "./pages/Signin"
import Profile from "./pages/Profile"
import About from "./pages/About"
import Signup from "./pages/Signup"
import Header from "./components/Header"
import PrivateRoute from "./components/privateRoute"
import CreateListing from "./pages/createListing"
export default function App() {
    return <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<Signin />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
      </Route>
    
    
    
    </Routes>

  </BrowserRouter>
}
