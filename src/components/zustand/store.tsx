import axios from "axios";
import { create } from "zustand";

export type Product = {
  id: number;
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
  fetchProduct: (id: number) => Promise<void>;
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
  removeFavorite: (productId: number) => void;
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
  removeFavorite: (productId) =>
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
    id: 0,
    image: "",
    price: 0,
    title: ""
  },
  error: null,
  fetchProduct: async (id: number) => {
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
  products: any[];
  isLoading: boolean;
  error: string | null;
  addProduct: (id:string,title: string, price: string, image: File | null) => Promise<void>;
}

export const useProductStoreAdd = create<ProductStoreAdd>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  addProduct: async (id: string,title: string, price: string, image: File | null) => {
    try {
      set({ isLoading: true }); // Set loading to true when API call starts
      const idTo = Number(id) + 1
      const newProduct = {

        id: idTo.toString(),
        title: title,
        price: price,
        image: image ? image.name : "",
      };

      // POST request to JSON Server
      const response = await axios.post("http://localhost:3000/products", newProduct);

      if (response.status === 201) {
        set((state) => ({
          products: [...state.products, response.data], // Add new product to the list
        }));
        alert("Product added successfully!");
      } else {
        set({ error: "Failed to add product" });
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      set({ error: "Failed to add product. Server error occurred." });
      alert("Failed to add product. Server error occurred.");
    } finally {
      set({ isLoading: false }); // Reset loading state
    }
  },
}));