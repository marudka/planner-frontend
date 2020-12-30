import React, { FunctionComponent } from 'react';
import { AddRecipeForm } from './AddRecipe';

// container -> view
// container -> connector -> view
// controller -> connector -> view

export const AddRecipeConnector: FunctionComponent = () => {
  const dummySubmit = async (values: any) => {
    console.log(values);
    return null;
  };

  return <AddRecipeForm submit={dummySubmit} />;
};
