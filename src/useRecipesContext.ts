import { useContext } from 'react';
import { RecipesContext, ContextRecipesType } from './Context';

const useRecipesContext = (): ContextRecipesType => {
  return useContext(RecipesContext);
};

export { useRecipesContext };