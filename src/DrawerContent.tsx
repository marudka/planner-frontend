import React, { FunctionComponent } from 'react';
import { Typography, Descriptions, Image, Tag, Empty } from 'antd';
import { useRecipesContext } from './useRecipesContext';
import { EditForm } from './EditForm';

const { Title, Text } = Typography;

interface DrawerContentProps {
  id: string;
  isEditMode: boolean;
}

export const DrawerContent: FunctionComponent<DrawerContentProps> = ({ id, isEditMode }) => {
  const { recipes } = useRecipesContext();
  const chosenRecipe = recipes.find((item) => item._id === id);

  if (!chosenRecipe) {
    return <Empty />;
  }

  const list = chosenRecipe.ingredients.map((item, key) => <li key={key}>{item.name} {item.count}, {item.unit}</li>);

  if (isEditMode) {
    return <EditForm chosenRecipe={chosenRecipe} id={id} />;
  }

  return (
    <>
      {chosenRecipe.image && (
        <Image width='100%' height='120' src={chosenRecipe.image} style={{ marginBottom: '12px' }} />
      )}
      {chosenRecipe.isVege && <Tag color='green'>Vegetarian</Tag>}
      {chosenRecipe.isGlutenFree && <Tag color='blue'>Is Gluten free</Tag>}
      <Title level={3} style={{ marginTop: '10px' }}>{chosenRecipe.name}</Title>
      {chosenRecipe.description && <Descriptions.Item label='Description'>{chosenRecipe.description}</Descriptions.Item>}
      {chosenRecipe.ingredients.length && <Title level={5}>Ingredients</Title>}
      <ul>
        {list}
      </ul>
      <Descriptions>
        {chosenRecipe.calories && <Descriptions.Item label='Portions'>{chosenRecipe.portions}</Descriptions.Item>}
        {chosenRecipe.calories && <Descriptions.Item label='Calories'>{chosenRecipe.calories}</Descriptions.Item>}
      </Descriptions>
    </>
  )
};