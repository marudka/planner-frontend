import React, { FunctionComponent, useState } from 'react';
import { Typography, Descriptions, Image, Input, Form, Select, Button, Tag, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRecipesContext } from './useRecipesContext';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {fetchData, MethodType} from './useFetch';
import {BASE_URL} from "./constants/config";

const { Title } = Typography;
const { Option} = Select;

interface DrawerContentProps {
  id: string;
  isEditMode: boolean;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const DrawerContent: FunctionComponent<DrawerContentProps> = ({ id, isEditMode }) => {
  const { recipes, setRecipes } = useRecipesContext();
  const chosenRecipe = recipes.find((item) => item._id === id);

  if (!chosenRecipe) {
    return <Empty />;
  }

  const list = chosenRecipe.ingredients.map((item, key) => <li key={key}>{item.name} {item.count}, {item.unit}</li>);

  const onFinish = () => {
    console.log('test');
  };

  const onFinishFailed = () => {
    console.log('test finish');
  };

  const handleChange = () => {

  };

  const handleBlur = () => {

  };

  const handleIngredientNameChange = () => {

  };

  const handleIngredientCountChange = () => {

  };

  const handleDeleteRecipe = () => {
    fetchData(`${BASE_URL}/recipes/${id}`, MethodType.DELETE).then(() => {
      const index = recipes.findIndex((item) => item._id === id);
      const copyRecipes = [...recipes];
      copyRecipes.splice(index, 1);
      setRecipes(copyRecipes);
    });
  };

  if (isEditMode) {
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
            <Input value={chosenRecipe.name} defaultValue={chosenRecipe.name} name='name' onChange={handleChange} onBlur={handleBlur} />
          </Form.Item>

          <Form.Item
            label='Description'
            rules={[{ required: false }]}
          >
            <Input.TextArea value={chosenRecipe.description} defaultValue={chosenRecipe.name} name='description' onChange={handleChange} onBlur={handleBlur} />
          </Form.Item>

          {list}

          <Form.Item label='Add ingredient'>
            <Input.Group compact>
              <Input style={{ width: '200px' }} />
              <Input style={{ width: '80px' }} />
              <Select defaultValue="gram">
                <Option value="gram">gram</Option>
                <Option value="unit">unit</Option>
              </Select>
              <Button type="primary"><PlusOutlined /></Button>
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
  }

  return (
    <div>
      {chosenRecipe.image && (
        <Image width='100%' height='120' src={chosenRecipe.image} />
      )}
      <Tag color='blue'>Vegetarian</Tag>
      <Title level={3}>{chosenRecipe.name}</Title>
      {chosenRecipe.description && <Descriptions.Item label='Description'>{chosenRecipe.description}</Descriptions.Item>}
      <Title level={5}>Ingredients</Title>
      <ul>
        {list}
      </ul>
    </div>
  )
};