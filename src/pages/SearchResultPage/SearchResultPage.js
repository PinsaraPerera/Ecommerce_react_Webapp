import React from 'react';
import "./SearchResultPage.scss";
import ProductList from '../../components/ProductList/ProductList';
import { useSelector } from 'react-redux';
import Slider from '../../components/Slider/Slider';

const SearchPage = () => {
  const {data: searchData, status: searchStatus} = useSelector((state) => state.search);
  const {data1} = searchData;

  return (
    
    <div className = "home-page">
      <Slider />
      <ProductList products = {searchData} status = {searchStatus} />
      <div>{data1 ? <p></p> : <p className = "text-uppercase fw-7 text-regal-blue ls-1">No content to display</p>}</div>
    </div>

  )
}

export default SearchPage;