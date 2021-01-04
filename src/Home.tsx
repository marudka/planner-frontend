import React, { FunctionComponent, useState } from 'react';
import { Calendar, Layout, Spin, Input, Typography, Modal, Button, Checkbox, Drawer, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { fetchData } from './useFetch';

import { MethodType } from './useFetch';
import { Recipes } from './Recipes';
import { Ingredient, RecipeType } from './Recipes';
import { BASE_URL } from './constants/config';
import { useRecipesContext } from './useRecipesContext';
import { DrawerContent } from './DrawerContent';

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
  const [isVisibleDrawer, setVisibleDrawer] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [chosenRecipeToShow, setRecipeToShow] = useState<string | null>(null);

  const handleShowDrawer = (id: string, isEdit: boolean) => {
    setRecipeToShow(id);
    setEditMode(isEdit);
    setVisibleDrawer(true);
  };

  const onCloseDrawer = () => {
    setVisibleDrawer(false);
  };

  const handleSetRecipeToDate = (ingredients: Ingredient[], id: string) => {
    setIngredients(addCheckboxValues(ingredients));
    setRecipeToDateModalVisibility(true);
    setRecipeId(id);
  };

  const handleCancel = () => {
    setRecipeToDateModalVisibility(false);
  };

  const recipesStatus = !recipes.length ? <Spin /> : null;
  const recipesList = recipes.length ? <Recipes date={date} setRecipeToDate={handleSetRecipeToDate} showDrawer={handleShowDrawer} /> : null;

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
      // const chosenRecipe = recipes.find((item) => item._id === chosenRecipeId);
      const time = moment(date).format('L');
      const filteredIngredients = ingredients.filter((item) => item.isChecked);
      let body = {};
      const updatedRecipes = recipes.map((item) => {
        if (chosenRecipeId === item._id) {
          body = {
            days: {
              ...item.days,
              [time]: filteredIngredients
            }
          };
          return  {
            ...item,
            ...body
          }
        }
        return item;
      });
      fetchData(`${BASE_URL}/recipes/${chosenRecipeId}`, MethodType.PATCH, body).then(() => {
        setRecipeToDateModalVisibility(false);
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

  const handleDeleteFromDay = (day: any, id: any) => {
    const clickedRecipe = recipes.find((item) => item._id === id);
    if (clickedRecipe) {
      const daysToChange = {...clickedRecipe.days};
      delete daysToChange[day];
      const body = {
        days: daysToChange
      };

      fetchData(`${BASE_URL}/recipes/${id}`, MethodType.PATCH, body).then((result) => {
        const updatedRecipes = recipes.map((item) => {
          if (id === item._id) {
            return  {
              ...item,
              days: daysToChange
            }
          }
          return item;
        });

        setRecipes(updatedRecipes);
      });
    }
  };

  const dataCellRender = (value: any) => {
    const listData = getListData(value);
    const key = moment(value).format('L');
    return (
      <ul className='recipes' style={{ paddingLeft: '0' }}>
        {listData.map((item) => {
          return (
            // @ts-ignore
            <li>
              <div>
                <span className='truncate'>{item.name}</span>
              </div>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteFromDay(key, item._id)}
                size='small'
                shape='circle'
                style={{ marginLeft: '3px' }}
              />
            </li>
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
      <Drawer
        title='Recipe details'
        placement='right'
        closable={false}
        onClose={onCloseDrawer}
        visible={isVisibleDrawer}
        width={400}
      >
        {chosenRecipeToShow && <DrawerContent id={chosenRecipeToShow} isEditMode={isEditMode} />}
      </Drawer>
    </Layout>
  )
};
