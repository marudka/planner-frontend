import React, { FunctionComponent } from 'react';
import { Typography, Descriptions, Image, Tag, Empty } from 'antd';
import { useRecipesContext } from './useRecipesContext';
import { EditForm } from './EditForm';

const { Title } = Typography;

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
    return <EditForm name={chosenRecipe.name} description={chosenRecipe.description} id={id} />;
  }

  return (
    <>
      {chosenRecipe.image && (
        <Image width='100%' height='120' src={chosenRecipe.image} style={{ marginBottom: '12px' }} />
      )}
      <Tag color='blue'>Vegetarian</Tag>
      <Title level={3} style={{ marginTop: '10px' }}>{chosenRecipe.name}</Title>
      {chosenRecipe.description && <Descriptions.Item label='Description'>{chosenRecipe.description}</Descriptions.Item>}
      <Title level={5}>Ingredients</Title>
      <ul>
        {list}
      </ul>
    </>
  )
};