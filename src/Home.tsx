import React, { FunctionComponent, useState } from 'react';
import { Calendar, Layout, Spin, Input, Typography, Modal, Button, Checkbox } from 'antd';
import moment, { Moment } from 'moment';
import { fetchData } from './useFetch';

import { useFetch, MethodType } from './useFetch';
import { Recipes } from './Recipes';
import { Ingredient, RecipeType } from './Recipes';
import { BASE_URL } from './constants/config';
import { useRecipesContext } from './useRecipesContext';

const { Content, Sider } = Layout;
const { Search } = Input;
const { Title } = Typography;

interface CheckboxType extends Ingredient {
  isChecked: boolean;
  id: string;
}

interface DayType {
  name: string;
  count: string;
  unit: string;
}

export interface DaysType {
  [key: string]: DayType[]
}

const addCheckboxValues = (ingredients: Ingredient[]) => {
  return ingredients.map((item, key) => {
    return {
      ...item,
      isChecked: true,
      id: `checkbox-${key}`
    }
  })
};

export const Home: FunctionComponent = () => {
  const { recipes, setRecipes } = useRecipesContext();
  const [date, setDate] = useState(moment());
  const [recipeToDateModalVisibility, setRecipeToDateModalVisibility] = useState(false);
  const [ingredients, setIngredients] = useState<CheckboxType[]>([]);
  const [chosenRecipeId, setRecipeId] = useState<string | null>(null);

  const handleSetRecipeToDate = (ingredients: Ingredient[], id: string) => {
    setIngredients(addCheckboxValues(ingredients));
    setRecipeToDateModalVisibility(true);
    setRecipeId(id);
  };

  const handleCancel = () => {
    setRecipeToDateModalVisibility(false);
  };

  const recipesStatus = !recipes.length ? <Spin /> : null;
  const recipesList = recipes.length ? <Recipes date={date} setRecipeToDate={handleSetRecipeToDate} /> : null;

  const handleChange = (value: any) => {
    setDate(value);
  };

  const onChangeCheckbox = (event: any) => {
    const changedList = ingredients.map((item) => {
      if (item.id === event.target.value) {
        return {
          ...item,
          isChecked: !item.isChecked
        }
      }
      return item;
    });
    setIngredients(changedList);
  };

  const handleButtonClick = () => {
    if (chosenRecipeId) {
      const time = moment(date).format('L');
      const filteredIngredients = ingredients.filter((item) => item.isChecked);
      const body = {
        days: {
          [time]: filteredIngredients
        }
      };
      fetchData(`${BASE_URL}/recipes/${chosenRecipeId}`, MethodType.PATCH, body).then((result) => {
        setRecipeToDateModalVisibility(false);
        const updatedRecipes = recipes.map((item) => {
          if (chosenRecipeId === item._id) {
            return  {
              ...item,
              ...body
            }
          }
          return item;
        });

        setRecipes(updatedRecipes);
      });
    }
  };

  const getListData = (value: Moment): RecipeType[] => {
    const key = moment(value).format('L');
    return recipes.filter((item: RecipeType) => {
      if (!item.days) {
        return false;
      }
      return Boolean(item.days[key]);
    });
  };

  const dataCellRender = (value: any) => {
    const listData = getListData(value);
    return (
      <ul className='recipes'>
        {listData.map((item) => {
          return (
            <li>{item.name}</li>
          )
        })}
      </ul>
    );
  };

  return (
    <Layout>
      <Sider width={300} theme='light' style={{ padding: '0 20px'}}>
        <Title level={4} style={{ marginTop: '10px' }}>List of recipes</Title>
        <Search enterButton />
        {recipesStatus}
        {recipesList}
      </Sider>
      <Layout>
        <Content style={{ padding: '20px' }}>
          <Calendar onChange={handleChange} value={date} dateCellRender={dataCellRender} />
        </Content>
      </Layout>
      <Modal
        visible={recipeToDateModalVisibility}
        title='Check list of ingredients to buy'
        footer={null}
        onCancel={handleCancel}
      >
        <div>
          {
            ingredients.map((item) => {
              return (
                <Checkbox
                  onChange={onChangeCheckbox}
                  checked={item.isChecked}
                  value={item.id}
                  style={{display: 'block', marginLeft: 0 }}
                >
                  {item.name}, {item.count} {item.unit}
                </Checkbox>
              )
            })
          }
        </div>
        <Button type='primary' style={{ marginTop: '20px' }} onClick={handleButtonClick}>
          Accept list and add to selected day
        </Button>
      </Modal>
    </Layout>
  )
};
