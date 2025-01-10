import { useState, useEffect } from "react";
import { Product } from "./zustand/store";
import { Link } from "react-router-dom";
import { useStore, useProductStoreID } from "./zustand/store"; // Import store

type CardProps = {
  load: boolean;
  product: Product;
};

function Card({ load, product }: CardProps): JSX.Element {
  const [like, setLike] = useState(false);
  const { toggleFavorite } = useStore(); // Access store functions
  const { fetchProduct } = useProductStoreID(); // Access fetch function for product by ID

  // Check if the product is in the favorites list
  useEffect(() => {
    const isFavorite = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ).some((item: Product) => item.id === product.id);
    setLike(isFavorite); // Update the like state
  }, [product.id]);

  function changeLike() {
    setLike((prev) => !prev);
    toggleFavorite(product); // Toggle the favorite when clicked
  }

  function handleViewProduct() {
    fetchProduct(product.id); // Fetch product by ID
  }

  return (
    <div className="w-full relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-orange-700">
      <div
        onClick={changeLike}
        className="flex absolute top-2 bg-blue-300 hover:bg-opacity-100 transition-all bg-opacity-50 rounded-full py-5 px-5 left-2 items-center mt-2.5 mb-5"
      >
        {!like ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-heart text-white"
            viewBox="0 0 16 16"
          >
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-heart-fill text-red-600"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
            />
          </svg>
        )}
      </div>
      <Link to={`/products/${product.id}`}>
        <img
          className="h-[200px] w-full rounded-t-lg"
          src={product.image}
          alt={product.image  }
        />
      </Link>
      <div className="px-5 pb-5">
        <Link to={`/products/${product.id}`}>
          <a href="#">
            <h5 className="text-xl whitespace-nowrap text-ellipsis py-5 overflow-hidden font-semibold tracking-tight text-gray-900 dark:text-white">
              {load ? "loading" : product.title}
            </h5>
          </a>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-300">
            ${product.price}
          </span>
          <Link
            onClick={handleViewProduct}
            to={`/products/${product.id}`}
            className="text-white capitalize bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            посмотреть
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
