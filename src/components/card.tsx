import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "./zustand/store";
import { useStore, useProductStoreID, useProductStoreAdd } from "./zustand/store";
import EditProductModal from "../components/editModal"; // Import the modal component

type CardProps = {
  load: boolean;
  product: Product;
};

function Card({ product }: CardProps): JSX.Element {
  const [like, setLike] = useState(false);
  const { toggleFavorite } = useStore();
  const { fetchProduct } = useProductStoreID();
  const { deleteProduct } = useProductStoreAdd();
  const [showDown, setShowDown] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing the modal

  function toggleDrop() {
    setShowDown(!showDown);
  }
  useEffect(() => {
    fetchProduct
  },[product])

  useEffect(() => {
    const isFavorite = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ).some((item: Product) => item.id === product.id);
    setLike(isFavorite);
  }, [product.id]);

  function changeLike() {
    setLike((prev) => !prev);
    toggleFavorite(product);
  }

  function handleViewProduct() {
    fetchProduct(product.id);
  }

  // Delete product
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(product.id);
    }
  };


  // Open modal to edit product
  const handleEdit = () => {
    setShowModal(true); // Open modal
  };

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
      <div
        className="cursor-pointer absolute right-4 top-4"
        onClick={toggleDrop}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-three-dots-vertical"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM8 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM8 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM5 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM5 7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z" />
        </svg>
      </div>
      {showDown && (
        <div className="absolute right-5 top-16 text-white text-sm bg-gray-700 p-2 rounded-lg">
          <ul>
            <li>
              <button
                onClick={handleDelete} // Delete
                className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-500 dark:hover:text-white"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 0a1 1 0 0 1 1 1v1h7a1 1 0 0 1 1 1v1a1 1 0 0 1-.553.894L12 5v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5l-2.447-1.106A1 1 0 0 1 1 3V2a1 1 0 0 1 1-1h7V1a1 1 0 0 1 1-1zM7 1v1h2V1H7z" />
                  </svg>
                </span>
                <span className="text-red-600">Delete</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleEdit} // Opens the modal
                className="flex w-full items-center gap-2 px-4 py-2 hover:bg-blue-500 dark:hover:text-white"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pencil"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.146.354a1 1 0 0 1 1.415 1.414l-8 8a1 1 0 0 1-.374.24l-3 1a1 1 0 0 1-.267.028 1 1 0 0 1-.727-.727l1-3a1 1 0 0 1 .24-.374l8-8a1 1 0 0 1 1.414 0z" />
                  </svg>
                </span>
                <span>Edit</span>
              </button>
            </li>
          </ul>
        </div>
      )}

      <Link to={`/products/${product.id}`} onClick={handleViewProduct}>
        <img
          className="rounded-t-lg w-full h-72 object-cover"
          src={product.image}
          alt="Product"
        />
      </Link>
      <div className="p-5">
        <h5 className="text-lg font-bold text-gray-900 dark:text-white">
          {product.title}
        </h5>
        <div className="flex items-center mt-4">
          <span className="text-gray-900 dark:text-white">${product.price}</span>
        </div>
      </div>

      {/* Modal for Editing */}
      <EditProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={product}
      />
    </div>
  );
}

export default Card;
