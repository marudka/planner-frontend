import React, { FunctionComponent } from 'react';
import { Card, Badge, Tooltip } from 'antd';
import { ExportOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Moment } from 'moment';

import { RecipeType, Ingredient } from './Recipes';

interface RecipesProps {
  recipe: RecipeType;
  date: Moment;
  setRecipeToDate: (ingredients: Ingredient[], id: string) => void;
  showDrawer: (id: string, isEdit: boolean) => void;
}

const { Meta } = Card;

export const Recipe: FunctionComponent<RecipesProps> = ({ recipe, date, setRecipeToDate, showDrawer }) => {
  const onClick = () => {
    setRecipeToDate(recipe.ingredients, recipe._id);
  };

  const onClickEye = () => {
    showDrawer(recipe._id, false);
  };

  const onClickEdit = () => {
    showDrawer(recipe._id, true);
  };

  return (
    <Badge.Ribbon text='Vegetarian'>
      <Card
        actions={[
          <Tooltip title='Assigne to day' color='blue'><ExportOutlined key='export' onClick={onClick} /></Tooltip>,
          <Tooltip title='Show recipe details' color='blue'><EyeOutlined key='show' onClick={onClickEye} /></Tooltip>,
          <Tooltip title='Edit recipe' color='blue'><EditOutlined key="edit" onClick={onClickEdit} /></Tooltip>,
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
    </Badge.Ribbon>
  )
};