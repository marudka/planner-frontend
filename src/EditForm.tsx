import React, { FunctionComponent, useState } from 'react';
import { Input, Form, Select, Button, Tag, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRecipesContext } from './useRecipesContext';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchData, MethodType } from './useFetch';
import { RecipeType, Ingredient } from './Recipes';
import { BASE_URL } from './constants/config';
import { FormikErrors, FormikProps, withFormik } from 'formik';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface FormValues {
  name: string;
  description: string;
  ingredients: Ingredient[];
  id: string;
}

interface DrawerContentProps {
  id: string;
  chosenRecipe: RecipeType;
}

interface Props {
  // submit: (values: FormValues) => Promise<FormikErrors<FormValues> | null>;
  name: string;
  description?: string;
  ingredients?: Ingredient[];
  id: string;
}

const Edit: FunctionComponent<FormikProps<FormValues> & Props> = ({ values, handleChange }) => {
  const { recipes, setRecipes } = useRecipesContext();
  const [ingredients, setIngredients] = useState(values.ingredients);

  const list = values.ingredients.map((item, key) =>
    <li key={key}>{item.name} {item.count}, {item.unit} <b>minus</b></li>);

  const onFinish = () => {
    const body = {
      name: values.name,
      description: values.description,
      ingredients: ingredients
    };

    fetchData(`${BASE_URL}/recipes/${values.id}`, MethodType.PATCH, body).then(() => {
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
    });
  };

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
    fetchData(`${BASE_URL}/recipes/${values.id}`, MethodType.DELETE).then(() => {
      const index = recipes.findIndex((item) => item._id === values.id);
      const copyRecipes = [...recipes];
      copyRecipes.splice(index, 1);
      setRecipes(copyRecipes);
    });
  };

  return (
    <div>
      <Form
        {...layout}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label='Name'
          rules={[{ required: true, message: 'Please input recipe name!' }]}
        >
          <Input value={values.name} defaultValue={values.name} name='name' onChange={handleChange} onBlur={handleBlur} />
        </Form.Item>

        <Form.Item
          label='Description'
          rules={[{ required: false }]}
        >
          <Input.TextArea value={values.description} defaultValue={values.name} name='description' onChange={handleChange} onBlur={handleBlur} />
        </Form.Item>

        {list}

        <Form.Item label='Add ingredient'>
          <Input.Group compact>
            <Input />
            <Input />
            <Select defaultValue='gram'>
              <Option value='gram'>gram</Option>
              <Option value='unit'>unit</Option>
            </Select>
            <Button type='primary'><PlusOutlined /></Button>
          </Input.Group>
        </Form.Item>

        <div>
          <Button htmlType='submit' icon={<EditOutlined />} style={{ marginRight: '8px' }}>
            Edit recipe
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDeleteRecipe}>
            Remove recipe
          </Button>
        </div>
      </Form>
    </div>
  );
};

export const EditForm = withFormik<Props, FormValues>({
  mapPropsToValues: (props) => ({
    name: props.name,
    description: props.description || '',
    ingredients: props.ingredients || [],
    id: props.id
  }),

  // Custom sync validation
  validate: values => {
    const errors = {};

    if (!values.name) {
      // @ts-ignore
      errors.name = 'Required';
    }

    return errors;
  },

  handleSubmit: (values, { setSubmitting }) => {
    setSubmitting(false);
  },

  displayName: 'EditForm',
  enableReinitialize: true,
})(Edit);