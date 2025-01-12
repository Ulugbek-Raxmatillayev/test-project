import { useEffect } from "react";
import Card from "../components/card";
import { useProductStore, Product } from "../components/zustand/store";
import ProductFilter from "../components/filter";
import { useStore } from "../components/zustand/store"; // Import the zustand store

function Products(): JSX.Element {
  const { products, error, fetchProduct } = useProductStore();
  const { showFavorites, favorites, loadFavorites, toggleShowFavorites } =
    useStore(); // Get store data

  useEffect(() => {
    fetchProduct(); // Fetch the products from API
    loadFavorites(); // Load favorites from localStorage on mount
  }, [fetchProduct, loadFavorites]); // Remove `products` from the dependency array

  if (error) {
    return (
      <div className="flex justify-center pt-40 items-center text-3xl ">
        <h1 className="text-gray-300 text-center">
          Упс, ошибка: <br /> {error}
        </h1>
      </div>
    );
  }

  // Filter products based on showFavorites flag
  const filteredProducts = showFavorites
    ? products.filter((product: Product) =>
        favorites.some((fav) => fav.id === product.id)
      )
    : products;

  // If 'showFavorites' is true and no favorites, show a message
  const noFavoritesMessage = showFavorites && favorites.length === 0;

  return (
    <div className="container mx-auto">
      <ProductFilter
        toggleShowFavorites={(value) => toggleShowFavorites(value)}
        showFavorites={showFavorites} // Pass the state to ProductFilter
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 mb-5">
        {noFavoritesMessage ? (
          <div className="col-span-full text-center text-xl text-gray-400">
            У вас пока нет избранных.
          </div>
        ) : (
          filteredProducts.map((product: Product) => (
            <Card key={product.id} load={false} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default Products;
