import { BrowserRouter, Routes ,Route } from "react-router-dom";
// import LoginRegisterPage from './pages/LoginRegister';
import RegisterPage from './pages/RegisterPage'; // ← Esto solo si es named export

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1> Home</h1>} />
        <Route path="/register" element={ <RegisterPage /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
