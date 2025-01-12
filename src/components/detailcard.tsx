import { useEffect } from "react";
import { useProductStoreID, useStore } from "../components/zustand/store";
import { Link, useParams } from "react-router-dom"; // To fetch the product ID from the URL

function DetailCard() {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const { isLoading, products, error, fetchProduct } = useProductStoreID();
  const { favorites, toggleFavorite } = useStore(); // Access favorites and toggle function

  // Fetch the product when the component mounts or when the product ID changes
  useEffect(() => {
    if (id) {
      fetchProduct(id); // Pass the product ID as a number
    }
  }, [id, fetchProduct]);

  // Check if the current product is already in favorites
  const isFavorite = favorites.some((fav) => fav.id === products.id);

  function changeLike() {
    toggleFavorite(products); // Toggle the favorite
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="container mx-auto my-10 flex items-center justify-center">
        <div className="flex relative flex-col overflow-hidden items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row h-[38vh] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <div
            onClick={changeLike}
            className="flex absolute z-10 top-2 right-[2rem] bg-blue-300 hover:bg-opacity-100 transition-all bg-opacity-50 rounded-full py-5 px-5 items-center mt-2.5 mb-5 "
          >
            {!isFavorite ? (
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
                  fillRule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                />
              </svg>
            )}
          </div>
          <img
            className="object-contain w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
            src={products.image}
            alt="product image"
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {products.title}
            </h5>
            <p className="mb-3 text-3xl font-bold font-normal text-gray-700 dark:text-gray-400">
              ${products.price}
            </p>
          </div>
        </div>
      </div>
      <Link to={'/products'} className="flex justify-center items-center gap-3 text-xl text-white">
        <button className="border flex items-center gap-3 p-4 rounded-xl hover:bg-slate-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-box-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
            />
            <path
              fill-rule="evenodd"
              d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
            />
          </svg>
          <span>Вернуться к продуктам</span>
        </button>
      </Link>
    </div>
  );
}

export default DetailCard;
