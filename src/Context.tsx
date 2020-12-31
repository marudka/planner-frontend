import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';

import { RecipeType } from './Recipes';
import { fetchData, MethodType } from './useFetch';
import { BASE_URL } from './constants/config';

export type ContextRecipesType = {
  setRecipes: (value: RecipeType[]) => void;
  getRecipes: () => void;
  recipes: RecipeType[];
}

const RECIPES_CONTEXT_DEFAULTS: ContextRecipesType = {
  recipes: [],
  setRecipes: () => {},
  getRecipes: () => {},
};

type StateRecipesType = Omit<ContextRecipesType, 'setRecipes' | 'getRecipes'>

const RecipesContext = createContext<ContextRecipesType>(RECIPES_CONTEXT_DEFAULTS);

const RecipesContextProvider = ({ children }: PropsWithChildren<Partial<ContextRecipesType>>) => {
  const [state, setState] = useState<Partial<StateRecipesType>>({
    recipes: []
  });

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = () => {
    fetchData(`${BASE_URL}/recipes`, MethodType.GET).then((result) => {
      setState({
        recipes: result
      });
    });
  };

  const setRecipes = (recipes: RecipeType[]) => {
    setState({
      recipes
    });
  };

  return (
    <RecipesContext.Provider value={{ ...RECIPES_CONTEXT_DEFAULTS, ...state, setRecipes, getRecipes }}>
      {children}
    </RecipesContext.Provider>
  );
};

const RecipesContextConsumer = RecipesContext.Consumer;

export { RecipesContextProvider, RecipesContext, RecipesContextConsumer };