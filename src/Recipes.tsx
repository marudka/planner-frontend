import React, { FunctionComponent } from 'react';
import { Moment } from 'moment';

import { Recipe } from './Recipe';
import { DaysType } from './Home';
import { useRecipesContext } from './useRecipesContext';

export interface Ingredient {
  name: string;
  count: string;
  unit: string
}

export interface RecipeType {
  name: string;
  _id: string;
  image: string;
  ingredients: Ingredient[];
  days: DaysType
}

export interface RecipesProps {
  date: Moment;
  setRecipeToDate: (ingredients: Ingredient[], id: string) => void;
}

export const Recipes: FunctionComponent<RecipesProps> = ({ date, setRecipeToDate }) => {
  const { recipes } = useRecipesContext();
  return (
    <div>
      {recipes.map((item, key) => {
        return <Recipe key={key} recipe={item} date={date} setRecipeToDate={setRecipeToDate} />
      })}
    </div>
  )
};