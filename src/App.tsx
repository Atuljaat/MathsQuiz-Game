import Maths from "./pages/Maths"
import { Route , Routes } from "react-router-dom"
import Login from "./pages/Login"
import Menu from "./pages/Menu"
import Level from "./pages/Level"
import Middleware from "./pages/Middleware"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={
          <Login />
        } />
      <Route path="/maths" element={
        <Middleware>
        <Maths />
        </Middleware>
        } />
      <Route path="/menu" element={
        <Middleware>
        <Menu />
        </Middleware>
        } />
      <Route path="/levels/:id" element={
        <Middleware>
        <Level/>
        </Middleware>
        } />
    </Routes> 
    </> 
  )
}

export default App
