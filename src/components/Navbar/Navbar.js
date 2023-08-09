import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../store/categorySlice";
import { getCartTotal } from "../../store/cartSlice";
import { cat } from "../../store/categorySlice";
import { STATUS } from "../../utils/status";
import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/apiURL";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    data: [],
    status: STATUS.IDLE,
  },

  reducers: {
    setSearch(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const searchReducer = searchSlice.reducer;
export const { setSearch, setStatus } = searchSlice.actions;

const Navbar = () => {
  const dispatch = useDispatch();
  const { data: categories } = useSelector((state) => state.category);
  const { totalItems } = useSelector((state) => state.cart);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [keyword, setkeyword] = useState("");
  const history = useNavigate();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getCartTotal());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchProduct = async (keyword) => {
    dispatch(setStatus(STATUS.LOADING));

    try {
      const response = await fetch(`${BASE_URL}products/search?q=${keyword}`);
      const data0 = await response.json();
      const data = data0.products;

      for (let i = 0; i < data.length; i++) {
        const id = cat.indexOf(data[i].category);
        const name = data[i].category;
        const image = "null";

        data[i].category = { id: id, name: name, image: image };
      }

      dispatch(setSearch(data));
      dispatch(setStatus(STATUS.IDLE));
      history("/search");

    } catch (error) {
      dispatch(setStatus(STATUS.ERROR));
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="container">
          <div className="navbar-top flex flex-between">
            <Link to="/" className="navbar-brand">
              <span className="text-regal-blue">Future</span>
              <span className="text-gold">Shopping</span>
            </Link>

            <form className="navbar-search flex">
              <input
                type="text"
                placeholder="Search here ..."
                onChange={(e) => setkeyword(e.target.value)}
              />
              <button
                type="button"
                className="navbar-search-btn"
                onClick={() => searchProduct(keyword)}
              >
                <i className="fas fa-search"></i>
              </button>
            </form>

            <div className="navbar-btns">
              <Link to="/cart" className="add-to-cart-btn flex">
                <span className="btn-ico">
                  <i className="fas fa-shopping-cart"></i>
                </span>
                <div className="btn-txt fw-5">
                  Cart
                  <span className="cart-count-value">{totalItems}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="navbar-bottom bg-regal-blue">
          <div className="container flex flex-between">
            <ul
              className={`nav-links flex ${
                isSidebarOpen ? "show-nav-links" : ""
              }`}
            >
              <button
                type="button"
                className="navbar-hide-btn text-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.id}`}
                    className="nav-link text-white"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="navbar-show-btn text-gold"
              onClick={() => setIsSidebarOpen(true)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
