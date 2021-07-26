import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';


const Search = React.memo(props => {
const [ filterIngredient, setFilterIngredient ] = useState('');
const { onLoadIngredients } = props;
const inputRef = useRef();

useEffect(() => {
  const timer = setTimeout(() => {
  if(filterIngredient === inputRef.current.value){
  const query = filterIngredient.length === 0 ? '' : `?orderBy="title"&equalTo="${filterIngredient}"`;
  fetch(
    "https://react-hooks-name-amount-default-rtdb.firebaseio.com/ingredients.json" + query
  )
    .then((response) => response.json())
    .then((responseData) => {
      const loadedIngredients = [];
      for ( const key in responseData ) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount
        });
      }
      // .....
      onLoadIngredients(loadedIngredients)
    });
   }
  }, 500)
  return () => {
    clearTimeout(timer);
  }
}, [filterIngredient, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
          ref={inputRef}
          value={filterIngredient} type="text" onChange={event => setFilterIngredient(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
