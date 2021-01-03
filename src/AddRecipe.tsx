import React, { FunctionComponent, useState } from 'react';
import {Form, Input, Button, Layout, Typography, Upload, Modal, Select, Alert} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';

import { BASE_URL } from './constants/config';
import { useRecipesContext } from './useRecipesContext';

const { Option } = Select;

interface AddRecipeProps {}

interface Ingredient {
  name: string | null;
  count: string | null;
  unit: string;
}

// @ts-ignore
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const { Content } = Layout;
const { Title } = Typography;

export const AddRecipe: FunctionComponent<AddRecipeProps> = () => {
  const [ingredients, addIngredients] = useState<Ingredient[]>([]);
  const [ingredient, setIngredient] = useState<Ingredient>({
    name: null,
    count: null,
    unit: 'gram'
  });
  const [images, setImages] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  });
  const [isAlertVisible, setAlertVisibility] = useState(false);
  const { recipes, setRecipes, getRecipes } = useRecipesContext();
  const formik = useFormik({
    initialValues: {
      name: '',
      description: ''
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
    onSubmit: (values, { resetForm, setSubmitting }) => {
      setSubmitting(false);
      resetForm();

      const formData = new FormData();
      if (images.fileList.length) {
        // @ts-ignore
        formData.append('file', images.fileList[0].originFileObj);
      }
      formData.append('name', values.name);
      if (values.description) {
        formData.append('description', values.description);
      }
      if (ingredients && ingredients.length) {
        formData.append('ingredients', JSON.stringify(ingredients));
      }

      fetch(`${BASE_URL}/recipes`, {
        method: 'POST',
        body: formData
      })
        .then((response) => response.json())
        .then(() => {
          getRecipes();
          setAlertVisibility(true);
        })
        .catch(error => console.log(error));
    },
    enableReinitialize: true,
  });

  // @ts-ignore
  const handleIngredientNameChange = (e) => {
    setIngredient({
      ...ingredient,
      name: e.target.value
    });
  };

  // @ts-ignore
  const handleIngredientCountChange = (e) => {
    setIngredient({
      ...ingredient,
      count: e.target.value
    });
  };

  // @ts-ignore
  const handleIngredientUnitChange = (e) => {
    setIngredient({
      ...ingredient,
      unit: e
    });
  };

  // @ts-ignore
  const handleAddIngredientClick= (e) => {
    if (ingredient.name && ingredient.count) {
      const ingredientsList = [...ingredients];
      ingredientsList.push(ingredient);
      addIngredients(ingredientsList);
    }
  };

  const handleCancel = () => setImages({
    ...images,
    previewVisible: false
  });

  // @ts-ignore
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setImages({
      ...images,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    });
  };

  // @ts-ignore
  const handleChangeImage = ({ fileList }) => {
    setImages({
      ...images,
      fileList: fileList
    });
  };

  const onFinish = () => {


    formik.handleSubmit();
  };

  // @ts-ignore
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const { previewVisible, previewImage, fileList, previewTitle } = images;

  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <Title level={2}>
          Add recipe
        </Title>
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
            <Input value={formik.values.name} name='name' onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </Form.Item>

          <Form.Item
            label='Description'
            rules={[{ required: false }]}
          >
            <Input.TextArea value={formik.values.description} name='description' onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            {ingredients && ingredients.map((item, key) =>  <div key={key}>{item.name}, {item.count} {item.unit}</div>)}
          </Form.Item>
          <Form.Item label='Add ingredient'>
            <Input.Group compact>
              <Input style={{ width: '200px' }} onChange={handleIngredientNameChange} />
              <Input style={{ width: '80px' }} onChange={handleIngredientCountChange} />
              <Select defaultValue="gram" onChange={handleIngredientUnitChange}>
                <Option value="gram">gram</Option>
                <Option value="unit">unit</Option>
              </Select>
              <Button type="primary" onClick={handleAddIngredientClick}><PlusOutlined /></Button>
            </Input.Group>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Upload
              listType='picture-card'
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChangeImage}
              beforeUpload={() => false}
              // customRequest={handleUploadImage}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type='primary' htmlType='submit'>
              Add recipe
            </Button>
          </Form.Item>
        </Form>
        {isAlertVisible && <Alert message='Recipe edited successfully.' type='success' style={{ marginTop: '10px' }} />}
      </Content>
    </Layout>
  );
};