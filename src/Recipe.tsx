import React, { FunctionComponent } from 'react';
import { Card } from 'antd';
import { ExportOutlined, EditOutlined } from '@ant-design/icons';
import { Moment } from 'moment';

import { RecipeType, Ingredient } from './Recipes';

interface RecipesProps {
  recipe: RecipeType;
  date: Moment;
  setRecipeToDate: (ingredients: Ingredient[], id: string) => void;
}

const { Meta } = Card;

export const Recipe: FunctionComponent<RecipesProps> = ({ recipe, date, setRecipeToDate }) => {
  const onClick = () => {
    setRecipeToDate(recipe.ingredients, recipe._id);
  };

  return (
    <Card
      actions={[
        <ExportOutlined key='export' onClick={onClick} />,
        <EditOutlined key="edit" />,
      ]}
      hoverable
      style={{ marginTop: '10px' }}
      cover={
        <img
          alt='example'
          src={recipe.image}
          height={80}
          style={{ objectFit: 'cover' }}
        />
      }
    >
      <Meta title={recipe.name} />
    </Card>
  )
};