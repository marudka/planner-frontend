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
  description?: string;
  isVege: boolean,
  isGlutenFree: boolean,
  portions: string,
  calories: string
}

export interface RecipesProps {
  date: Moment;
  setRecipeToDate: (ingredients: Ingredient[], id: string) => void;
  showDrawer: (id: string, isEdit: boolean) => void;
}

export const Recipes: FunctionComponent<RecipesProps> = ({ date, setRecipeToDate, showDrawer }) => {
  const { recipes } = useRecipesContext();
  return (
    <div>
      {recipes.map((item, key) => {
        return <Recipe key={key} recipe={item} date={date} setRecipeToDate={setRecipeToDate} showDrawer={showDrawer}/>
      })}
    </div>
  )
};