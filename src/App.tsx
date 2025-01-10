import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Products from "./pages/products";
import Detail from "./pages/detail";
import Navbar from "./components/navbar";
import CreateProduct from "./pages/createProduct";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Detail />} />
        <Route path="/create-product" element={<CreateProduct/>}/>
      </Routes>
    </>
  );
}

export default App;
