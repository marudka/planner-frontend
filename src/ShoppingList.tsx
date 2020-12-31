import React, { FunctionComponent, useState } from 'react';
import { Layout, Spin, Typography, DatePicker } from 'antd';
import moment from "moment";

import { RecipeType } from './Recipes';
import { useRecipesContext } from './useRecipesContext';

const { Content } = Layout;
const { Title } = Typography;

export const ShoppingList: FunctionComponent = () => {
  const { recipes } = useRecipesContext();
  const time = moment().format('L');
  const [date, setDate] = useState(time);
  const recipesStatus = !recipes.length ? <Spin /> : null;

  const handleChange = (date: any, dateString: any) => {
    setDate(moment(date).format('L'));
  };

  const recipesList = recipes.filter((item: RecipeType) => {
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
        <DatePicker onChange={handleChange} />
        {recipesStatus}
        {
          recipesList.map((item) => {
            // @ts-ignore
            return item.ingredients.map((item) => {
              return <div>{item.name}, {item.count} {item.unit}</div>
            })
          })
        }
      </Content>
    </Layout>
  );
};
