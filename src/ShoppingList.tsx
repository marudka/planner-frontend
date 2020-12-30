import React, { FunctionComponent, useState } from 'react';
import { Layout, Spin, Typography, DatePicker } from 'antd';
import moment from "moment";

import { MethodType, useFetch } from './useFetch';
import { RecipeType } from './Recipes';
import { BASE_URL } from './constants/config';

const { Content } = Layout;
const { Title } = Typography;

export const ShoppingList: FunctionComponent = () => {
  const { status, data } = useFetch(`${BASE_URL}/recipes`, MethodType.GET, null);
  const time = moment().format('L');
  const [date, setDate] = useState(time);
  const recipesStatus = status === 'fetching' ? <Spin /> : null;

  const handleChange = (date: any, dateString: any) => {
    setDate(moment(date).format('L'));
  };

  const recipes = data.filter((item: RecipeType) => {
    if (!item.days) {
      return false;
    }
    return Boolean(item.days[date]);
  });

  // @ts-ignore
  console.log(recipes);
  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <Title level={2}>
          Shopping list
        </Title>
        <DatePicker onChange={handleChange} />
        {recipesStatus}
        {
          recipes && recipes.length && recipes.map((item) => {
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
