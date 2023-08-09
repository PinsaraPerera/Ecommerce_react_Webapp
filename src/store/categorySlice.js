import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiURL";
import { STATUS } from "../utils/status";

export const cat = [
  "smartphones",
  "laptops",
  "fragrances",
  "skincare",
  "groceries",
  "home-decoration",
  "furniture",
  "tops",
  "womens-dresses",
  "womens-shoes",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "womens-watches",
  "womens-bags",
  "womens-jewellery",
  "sunglasses",
  "automotive",
  "motorcycle",
  "lighting",
];

// added below
async function fetchImageData(name) {
  const response = await fetch(
    `https://dummyjson.com/products/category/${name}`
  );
  const data = await response.json();
  return data.products[1].images[0]; 
}

async function convertDataToObjects(data) {
  const objectsArray = [];

  for (let i = 0; i < data.length; i++) {
    const id = i;
    const name = data[i];
    const image = await fetchImageData(data[i]);

    const object = { id, name, image };
    objectsArray.push(object);
  }

  return objectsArray;
}
// end of adding

const categorySlice = createSlice({
  name: "category",
  initialState: {
    data: [],
    status: STATUS.IDLE,
    catProductAll: [],
    catProductAllStatus: STATUS.IDLE,
    catProductSingle: [],
    catProductSingleStatus: STATUS.IDLE,
  },

  reducers: {
    setCategories(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setCategoriesProductAll(state, action) {
      state.catProductAll.push(action.payload);
    },
    setCategoriesStatusAll(state, action) {
      state.catProductAllStatus = action.payload;
    },
    setCategoriesProductSingle(state, action) {
      state.catProductSingle = action.payload;
    },
    setCategoriesStatusSingle(state, action) {
      state.catProductSingleStatus = action.payload;
    },
  },
});

export const {
  setCategories,
  setStatus,
  setCategoriesProductAll,
  setCategoriesStatusAll,
  setCategoriesProductSingle,
  setCategoriesStatusSingle,
} = categorySlice.actions;
export default categorySlice.reducer;

export const fetchCategories = () => {
  return async function fetchCategoryThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await fetch(`${BASE_URL}products/categories`);
      const data0 = await response.json();

      (async () => {
        try {
          const convertedData = await convertDataToObjects(data0);
          const data = convertedData;
          dispatch(setCategories(data.slice(0, 12)));
          dispatch(setStatus(STATUS.IDLE));
        } catch (error) {
          console.error("Error fetching image data:", error);
        }
      })();
    } catch (error) {
      dispatch(setStatus(STATUS.ERROR));
    }
  };
};

export const fetchProductsByCategory = (categoryID, dataType) => {
  return async function fetchCategoryProductThunk(dispatch) {
    if (dataType === "all") dispatch(setCategoriesStatusAll(STATUS.LOADING));
    if (dataType === "single")
      dispatch(setCategoriesStatusSingle(STATUS.LOADING));

    try {
      const response = await fetch(
        `${BASE_URL}products/category/${cat[categoryID]}`
      );
      const data0 = await response.json();
      const data = data0.products;

      for (let i = 0; i < data.length; i++) {
        const id = cat.indexOf(data[i].category);
        const name = data[i].category;
        const image = "null";
    
        data[i].category = {"id":id,"name":name,"image":image};
      }

      if (dataType === "all") {
        dispatch(setCategoriesProductAll(data.slice(0, 10)));
        dispatch(setCategoriesStatusAll(STATUS.IDLE));
      }
      if (dataType === "single") {
        dispatch(setCategoriesProductSingle(data.slice(0, 20)));
        dispatch(setCategoriesStatusSingle(STATUS.IDLE));
      }
    } catch (error) {
      dispatch(setCategoriesStatusAll(STATUS.ERROR));
    }
  };
};
