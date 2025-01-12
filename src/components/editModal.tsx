import React, { useState, useEffect } from "react";
import { useProductStoreAdd } from "./zustand/store";
import { Product } from "./zustand/store";

type EditProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
};

const EditProductModal = ({ isOpen, onClose, product }: EditProductModalProps) => {
  const { editProduct } = useProductStoreAdd(); // Get the editProduct method
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price.toString());
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setPrice(product.price.toString());
    }
  }, [product]);

  const handleSubmit = async () => {
    const updatedProduct: Product = {
      ...product,
      title,
      price: parseFloat(price),
      image: image ? URL.createObjectURL(image) : product.image,
    };
    
    // PUT request to update the product
    await editProduct(product.id, updatedProduct);  // Use editProduct here
    
    onClose();  // Close modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4">Edit Product</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
