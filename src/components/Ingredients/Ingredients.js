import React, { useCallback, useEffect, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import IngredientsList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!!");
  }
};

const httpReducer = (curhttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...curhttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curhttpState, error: null };
    default:
      throw new Error("Should not be reached!!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, httpDispatch] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  // const addIngredientsHandle = ingre => {
  //   console.log('add check data', ingre)
  //   setUserIngredients(prevIngredients => [ ...prevIngredients,
  //     { id: Math.random().toString(), ...ingre }
  //    ]);
  // };

  // useEffect(() => {
  //   fetch(
  //     "https://react-hooks-name-amount-default-rtdb.firebaseio.com/ingredients.json"
  //   )
  //     .then((response) => response.json())
  //     .then((responseData) => {
  //       const loadedIngredients = [];
  //       for ( const key in responseData ) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         });
  //       }
  //        setUserIngredients(loadedIngredients);
  //     });
  // },[]);

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const filterIngredientHandler = useCallback((ingre) => {
    // setUserIngredients(ingre);
    dispatch({ type: "SET", ingredients: ingre });
  }, []);

  const addIngredientsHandle = (ingre) => {
    // setIsLoading(true);
    httpDispatch({ type: "SEND" });
    fetch(
      "https://react-hooks-name-amount-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingre),
        headers: { "Content-Type": "application.json" },
      }
    )
      .then((response) => {
        // setIsLoading(false);
        httpDispatch({ type: "RESPONSE" });
        return response.json();
      })
      .then((responseData) => {
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: responseData, ...ingre },
        // ]);
        dispatch({ type: "ADD", ingredient: { id: responseData, ...ingre } });
      })
      .catch((error) => {
        // setError('something went wrong!!');
        httpDispatch({ type: "ERROR", errorMessage: "something went wrong!!" });
      });
  };

  // const addIngredientsHandle = ingre => {
  //   fetch('https://react-hooks-name-amount-default-rtdb.firebaseio.com/ingredients.json', {
  //     method: 'POST',
  //     body: JSON.stringify(ingre),
  //     headers: { 'Content-Type' : 'application.json' }
  //   }).then(response => {
  //     return response.json();
  //   }).then( responseData => {
  //     setUserIngredients(prevIngredients => [ ...prevIngredients,
  //       { id: responseData, ...ingre }
  //      ]);
  //   });
  // };

  // const removeIngredientHandler = ingre => {
  //   console.log('remove item', ingre)
  //   const removeItem = [...userIngredients];
  //   removeItem.splice(ingre, 1);
  //   setUserIngredients(removeItem);
  // };

  const removeIngredientHandler = (ingredientId) => {
    // setIsLoading(true);
    httpDispatch({ type: "SEND" });
    fetch(
      `https://react-hooks-name-amount-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        // setIsLoading(false);
        httpDispatch({ type: "RESPONSE" });
        // setUserIngredients(previousIngredients =>
        //   previousIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        // );
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((error) => {
        // setError('something went wrong!!');
        httpDispatch({ type: "ERROR", errorMessage: "something went wrong!!" });
      });
  };

  const clearError = () => {
    httpDispatch({ type: "CLEAR" });
    // setError(null);
    // setIsLoading(false);
  };
  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientsHandle}
        isLoaded={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientHandler} />
        {/* Need to add list here! */}
        <IngredientsList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
