import React, { FunctionComponent } from 'react';
import { Typography, Descriptions } from 'antd';
import { useRecipesContext } from './useRecipesContext';

const { Title } = Typography;

interface DrawerContentProps {
  id: string
}

export const DrawerContent: FunctionComponent<DrawerContentProps> = ({ id }) => {
  const { recipes } = useRecipesContext();
  const chosenRecipe = recipes.find((item) => item._id === id);

  if (!chosenRecipe) {
    return null;
  }

  return (
    <div>
      {chosenRecipe.image && (
        <img
          alt='example'
          src={chosenRecipe.image}
          height={80}
          style={{ objectFit: 'cover' }}
        />
      )}
      <Title level={3}>{chosenRecipe.name}</Title>
      {chosenRecipe.description && <Descriptions.Item label='Description'>{chosenRecipe.description}</Descriptions.Item>}
      <Title level={5}>Ingredients</Title>
      <ul>
        {chosenRecipe.ingredients.map((item, key) => <li key={key}>{item.name} {item.count}, {item.unit}</li>)}
      </ul>
    </div>
  )
};