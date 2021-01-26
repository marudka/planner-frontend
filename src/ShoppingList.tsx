import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { Layout, Spin, Typography, DatePicker } from 'antd';
import moment from 'moment';

import { RecipeType } from './Recipes';
import { useRecipesContext } from './useRecipesContext';
import { SocketContext } from './context/socket';

const { Content } = Layout;
const { Title } = Typography;

export const ShoppingList: FunctionComponent = () => {
  const { recipes } = useRecipesContext();
  const time = moment().format('L');
  const [date, setDate] = useState(time);
  const [actualRecipes, setActualRecipes] = useState<RecipeType[] | []>([]);
  const recipesStatus = !recipes.length ? <Spin /> : null;
  const socket = useContext(SocketContext);

  useEffect(() => {
    setActualRecipes(recipes)
  }, [recipes]);

  useEffect(() => {
    // @ts-ignore
    socket.on('RECIPE_ADDED_TO_DAY', (data: RecipeType) => {
      const changedRecipes = recipes.map((item) => {
        if (item._id === data._id) {
          return data;
        }
        return item;
      });
      setActualRecipes(changedRecipes);
    });
  }, [socket]);

  const handleChange = (date: any) => {
    setDate(moment(date).format('L'));
  };

  console.log('recipes', recipes);
  console.log('actual', actualRecipes);

  const recipesList = actualRecipes.filter((item: RecipeType) => {
    if (!item.days) {
      return false;
    }
    return Boolean(item.days[date]);
  });

  // @ts-ignore
  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <Title level={2}>
          Shopping list
        </Title>
        <Title level={5}>Select date to chose ingredients list to buy</Title>
        <DatePicker onChange={handleChange} defaultValue={moment()} style={{ marginBottom: '20px' }} />
        {recipesStatus}
        {
          recipesList.map((item) => {
            return item.days[date].map((item, index) => {
              return <div key={index}>{item.name}, {item.count} {item.unit}</div>
            });
          })
        }
      </Content>
    </Layout>
  );
};
