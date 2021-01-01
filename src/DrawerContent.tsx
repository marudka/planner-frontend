import React, { FunctionComponent } from 'react';
import { Typography, Descriptions, Image, Input, Form, Select, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRecipesContext } from './useRecipesContext';

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
  const { recipes } = useRecipesContext();
  const chosenRecipe = recipes.find((item) => item._id === id);

  if (!chosenRecipe) {
    return null;
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
            name='name'
          >
            <Input value={chosenRecipe.name} defaultValue={chosenRecipe.name} name='name' onChange={handleChange} onBlur={handleBlur} />
          </Form.Item>

          <Form.Item
            label='Description'
            rules={[{ required: false }]}
          >
            <Input.TextArea value={chosenRecipe.description} name='description' onChange={handleChange} onBlur={handleBlur} />
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

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Edit recipe
            </Button>
            <Button type='primary' htmlType='submit' danger={true}>
              Remove recipe
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  return (
    <div>
      {chosenRecipe.image && (
        <Image width='100%' height='120' style={{ objectFit: 'cover' }} src={chosenRecipe.image} />
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