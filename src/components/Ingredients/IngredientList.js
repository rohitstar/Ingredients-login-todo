import React from 'react';

import './IngredientList.css';

const IngredientList = props => {
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map(ig => (
          <li style={{ display: 'flex',   alignItems: 'center'}} key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
            <button className="ingredient-form__actions" >X</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
