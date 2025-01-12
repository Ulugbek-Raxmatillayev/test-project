import axios from "axios";
import { create } from "zustand";

export type Product = {
  id: string;
  image: string;
  price: number;
  title: string;
};

export type ProductStore = {
  isLoading: boolean;
  products: Product[];
  error: string | null;
  fetchProduct: () => Promise<void>;
};

export type ProductStoreId = {
  isLoading: boolean;
  products: Product;
  error: string | null;
  fetchProduct: (id: string) => Promise<void>;
};

// Zustand store for fetching all products
export const useProductStore = create<ProductStore>((set) => ({
  isLoading: false,
  products: [],
  error: null,
  fetchProduct: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<Product[]>(
        "http://localhost:3000/products"
      );
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },
}));

// Zustand store for managing favorites and filtering
export interface Store {
  favorites: Product[];
  showFavorites: boolean;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: Product) => void;
  loadFavorites: () => void; // Load favorites from localStorage
  toggleShowFavorites: (value: boolean) => void; // To toggle favorites filter
}

export const useStore = create<Store>((set) => ({
  favorites: [],
  showFavorites: false,
  loadFavorites: () => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      set({
        favorites: JSON.parse(savedFavorites), // Load from localStorage
      });
    }
  },
  addFavorite: (product) =>
    set((state) => {
      const updatedFavorites = [...state.favorites, product];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save to localStorage
      return { favorites: updatedFavorites };
    }),
  removeFavorite: (productId: string) =>
    set((state) => {
      const updatedFavorites = state.favorites.filter(
        (item) => item.id !== productId
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save updated list to localStorage
      return { favorites: updatedFavorites };
    }),
  toggleFavorite: (product) =>
    set((state) => {
      const isFavorite = state.favorites.some((item) => item.id === product.id);
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = state.favorites.filter(
          (item) => item.id !== product.id
        );
      } else {
        updatedFavorites = [...state.favorites, product];
      }
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save to localStorage
      return { favorites: updatedFavorites };
    }),
  toggleShowFavorites: () =>
    set((state) => ({
      showFavorites: !state.showFavorites,
    })),
}));

export const useProductStoreID = create<ProductStoreId>((set) => ({
  isLoading: false,
  products: {
    id: "",
    image: "",
    price: 0,
    title: "",
  },
  error: null,
  fetchProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<Product>(
        `http://localhost:3000/products/${id}`
      );
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch product", isLoading: false });
    }
  },
}));

// Zustand store definition
interface ProductStoreAdd {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (
    title: string,
    price: string,
    image: File | null
  ) => Promise<void>;
  editProduct: (id: string, updatedProduct: Product) => Promise<void>;
  deleteProduct:  (id: string) => Promise<void>;
}

export const useProductStoreAdd = create<ProductStoreAdd>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  // addProduct methodi
  addProduct: async (title: string, price: string, image: File | null) => {
    try {
      set({ isLoading: true });

      // FormData yaratish
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      if (image) {
        formData.append("image", image);
      }

      // POST so'rovni yuborish
      const response = await axios.post<Product>(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const resData: Product = response.data;
      if (response.status === 201) {
        set((state) => ({
          products: [...state.products, resData],
        }));
        alert("✅ Product added successfully!");
      } else {
        set({ error: "❌ Failed to add product" });
        alert("❌ Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      set({ error: "❌ Server error occurred while adding product." });
      alert("❌ Server error occurred while adding product.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete product methodi
  deleteProduct: async (id: string) => {
    try {
      set({ isLoading: true });
      await axios.delete(`http://localhost:3000/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
      alert("✅ Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      set({ error: "❌ Server error occurred while deleting product." });
      alert("❌ Failed to delete product.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Edit product methodi
  editProduct: async (id: string, updatedProduct: Product) => {
    try {
      set({ isLoading: true });

      // PUT so'rovini yuborish
      const response = await axios.put<Product>(
        `http://localhost:3000/products/${id}`,
        updatedProduct
      );

      if (response.status === 200) {
        // Ma'lumot yangilandi
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? updatedProduct : product
          ),
        }));
        alert("✅ Product updated successfully!");
      } else {
        set({ error: "❌ Failed to update product" });
        alert("❌ Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      set({ error: "❌ Server error occurred while updating product." });
      alert("❌ Server error occurred while updating product.");
    } finally {
      set({ isLoading: false });
    }
  },
}));