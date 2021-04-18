import React, { FunctionComponent, useState } from 'react';
import { Input, Form, Select, Button, Alert, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRecipesContext } from './useRecipesContext';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchData, MethodType } from './useFetch';
import { Ingredient, RecipeType } from './Recipes';
import { BASE_URL } from './constants/config';
import { useFormik } from 'formik';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface EditFormProps {
  id: string;
  chosenRecipe: RecipeType;
}

export const EditForm: FunctionComponent<EditFormProps> = ({ chosenRecipe, id }) => {
  const { recipes, setRecipes } = useRecipesContext();
  const [ingredientsList, setIngredients] = useState(chosenRecipe.ingredients);
  const [isAlertVisible, setAlertVisibility] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: chosenRecipe.name,
      description: chosenRecipe.description || '',
      ingredients: chosenRecipe.ingredients || [],
      isVege: chosenRecipe.isVege,
      isGlutenFree: chosenRecipe.isGlutenFree,
      portions: chosenRecipe.portions,
      calories: chosenRecipe.calories,
      id: id
    },
    validate: values => {
      setAlertVisibility(false);
      const errors = {};
      if (!values.name) {
        // @ts-ignore
        errors.name = 'Required';
      }
      return errors;
    },
    onSubmit: values => {
      const body = {
        name: values.name,
        description: values.description,
        ingredients: chosenRecipe.ingredients,
        isVege: values.isVege,
        isGlutenFree: values.isGlutenFree,
        portions: values.portions,
        calories: values.calories
      };

      fetchData(`${BASE_URL}/recipes/${formik.values.id}`, MethodType.PATCH, body).then(() => {
        const changedRecipes = recipes.map((item) => {
          if (item._id === values.id) {
            return {
              ...item,
              name: values.name,
              description: values.description
            }
          }
          return item;
        });
        setRecipes(changedRecipes);
        setAlertVisibility(true);
      });
    },
    enableReinitialize: true,
  });

  const list = ingredientsList && ingredientsList.map((item, key) =>
    <li key={key}>{item.name} {item.count}, {item.unit} <b>minus</b></li>);

  const onFinishFailed = () => {
    console.log('test finish');
  };

  const handleBlur = () => {

  };

  const handleIngredientNameChange = () => {

  };

  const handleIngredientCountChange = () => {

  };

  const handleDeleteRecipe = () => {
    fetchData(`${BASE_URL}/recipes/${formik.values.id}`, MethodType.DELETE).then(() => {
      const index = recipes.findIndex((item) => item._id === formik.values.id);
      const copyRecipes = [...recipes];
      copyRecipes.splice(index, 1);
      setRecipes(copyRecipes);
    });
  };

  console.log('formik', formik.values);

  return (
    <div>
      <Form
        {...layout}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={formik.submitForm}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label='Name'
          rules={[{ required: true, message: 'Please input recipe name!' }]}
        >
          <Input value={formik.values.name} name='name' onChange={formik.handleChange} onBlur={handleBlur} />
        </Form.Item>

        <Form.Item
          label='Description'
          rules={[{ required: false }]}
        >
          <Input.TextArea value={formik.values.description} name='description' onChange={formik.handleChange} onBlur={handleBlur} />
        </Form.Item>

        <Form.Item
          label='Portions'
          rules={[{ required: false }]}
        >
          <Input value={formik.values.portions} name='portions' onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item
          label='Calories'
          rules={[{ required: false }]}
        >
          <Input value={formik.values.calories} name='calories' onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item
          label='Is vegetarian'
          rules={[{ required: false }]}
        >
          <Checkbox onChange={formik.handleChange} name='isVege' value={formik.values.isVege} checked={formik.values.isVege} />
        </Form.Item>
        <Form.Item
          label='Is gluten free'
          rules={[{ required: false }]}
          name='isGlutenFree'
        >
          <Checkbox onChange={formik.handleChange} name='isGlutenFree' value={formik.values.isGlutenFree} checked={formik.values.isGlutenFree} />
        </Form.Item>

        {list}

        {/*<Form.Item label='Add ingredient'>*/}
        {/*  <Input.Group compact>*/}
        {/*    <Input />*/}
        {/*    <Input />*/}
        {/*    <Select defaultValue='gram'>*/}
        {/*      <Option value='gram'>gram</Option>*/}
        {/*      <Option value='unit'>unit</Option>*/}
        {/*    </Select>*/}
        {/*    <Button type='primary'><PlusOutlined /></Button>*/}
        {/*  </Input.Group>*/}
        {/*</Form.Item>*/}

        <div>
          <Button htmlType='submit' icon={<EditOutlined />} style={{ marginRight: '8px' }}>
            Edit recipe
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDeleteRecipe}>
            Remove recipe
          </Button>
        </div>
      </Form>
      {isAlertVisible && <Alert message='Recipe edited successfully.' type='success' style={{ marginTop: '10px' }} />}
    </div>
  );
};