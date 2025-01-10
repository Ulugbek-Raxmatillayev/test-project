type ProductFilterProps = {
  toggleShowFavorites: (value: boolean) => void; // Toggle function for filtering favorites
  showFavorites: boolean; // The state to track whether to show only favorites or all products
};

function ProductFilter({ toggleShowFavorites, showFavorites }: ProductFilterProps) {
  return (
    <div className="inline-flex my-5 rounded-md shadow-sm" role="group">
      {/* "Все" button - shows all products */}
      <button
        onClick={() => {
          if (showFavorites) toggleShowFavorites(false); // Faqat "Все" tugmasi bosilganda holatni o‘zgartiradi
        }}
        type="button"
        className={`px-4 py-2 w-[100px] text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700 ${
          !showFavorites ? "bg-gray-900 text-white" : "bg-transparent"
        }`}
      >
        Все
      </button>

      {/* "Изобраные" button - shows only favorites */}
      <button
        onClick={() => {
          if (!showFavorites) toggleShowFavorites(true); // Faqat "Изобраные" tugmasi bosilganda holatni o‘zgartiradi
        }}
        type="button"
        className={`px-4 py-2 w-[100px] text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700 ${
          showFavorites ? "bg-gray-900 text-white" : "bg-transparent"
        }`}
      >
        Изобраные
      </button>
    </div>
  );
}

export default ProductFilter;
