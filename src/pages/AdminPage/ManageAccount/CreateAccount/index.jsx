import { Form, Input, Button, message, Flex, Typography, Card } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { createUser } from '../../../../configs/api/user';

const CreateAccount = () => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    // Remove confirmPassword from the values as it's not required in the API payload
    const { confirmPassword, ...userData } = values;

    try {
      // Call createUser with the necessary fields
      await createUser(userData);
      message.success('Tạo tài khoản thành công!');
      form.resetFields();
    } catch (error) {
      message.error('Tạo tài khoản thất bại');
      console.error("Error creating user account:", error);
    }
  };

  return (
    <Flex style={{flexDirection:"column"}}>
    <Typography.Title style={{textAlign:"center", color: "#333333"}} level={2}>Tạo tài khoản mới</Typography.Title>
    <Flex justify='center'>
      <Form
        form={form}
        style={{ minWidth: '50%' }}
        name="create_account"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Không được để trống!' }]}
        >
          <Input prefix={<UserOutlined />} size='large' allowClear placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Không được để trống!' }]}
        >
          <Input prefix={<MailOutlined />} size='large' allowClear placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Không được để trống!' }]}
        >
          <Input.Password prefix={<LockOutlined />} size='large' allowClear placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Không được để trống!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} size='large' allowClear placeholder="Nhập lại mật khẩu" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Không được để trống!' },
            {
              pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b/,
              message: 'Số điện thoại không hợp lệ!',
            },
          ]}
        >
          <Input prefix={<PhoneOutlined />} size='large' allowClear placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item>
          <Flex justify='center'>
            <Button type="primary" htmlType="submit" size='large' style={{ width: '50%' }}>
              Tạo tài khoản
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
    </Flex>
  );
};

export default CreateAccount;
