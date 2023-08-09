import React from 'react';
import "./SearchResultPage.scss";
import ProductList from '../../components/ProductList/ProductList';
import { useSelector } from 'react-redux';
import Slider from '../../components/Slider/Slider';

const SearchPage = () => {
  const {data: searchData, status: searchStatus} = useSelector((state) => state.search);

  return (
    
    <div className = "home-page">
      <Slider />
      <ProductList products = {searchData} status = {searchStatus} />
      <div>{searchData.length ? <p></p> : <p className='text-red fw-6'><pre>                            No content to display</pre></p>}</div>
    </div>

  )
}

export default SearchPage;