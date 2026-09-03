import { useState } from "react";

function SearchFilter({ onSearch }) {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    onSearch({
      search,
      minPrice,
      maxPrice,
    });
  };

  const handleClear = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");

    onSearch({
      search: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="search-filter">
      <div className="filter-group">
        <label>Hotel Name</label>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search hotel..."
        />
      </div>

      <div className="filter-group">
        <label>Minimum Price</label>

        <input
          type="number"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          placeholder="Min price"
          min="0"
        />
      </div>

      <div className="filter-group">
        <label>Maximum Price</label>

        <input
          type="number"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="Max price"
          min="0"
        />
      </div>

      <div className="filter-buttons">
        <button type="button" onClick={handleSearch}>
          Search
        </button>

        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;