import "./LoginForm.css";
import { LockOutlined, EyeInvisibleOutlined, EyeOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Flex, Typography, message, notification } from "antd";
const { Title } = Typography;
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    try {
      const sendValue = {Email: values.email, Password: values.password} 
      dispatch(login(sendValue)).then((response) => {
        const userRole = response?.payload?.data?.roleName.toLowerCase();
        if(response.error){
          message.error("Sai email hoặc mật khẩu!")
        } else if (userRole === "admin" || userRole === "manager"){
          navigate(`/${userRole}`);
        } else {
          notification.error({
            message: "Truy cập bị từ chối",
            description: "Không có quyền truy cập",
            placement: "topRight",
            duration: 3,
          })
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
      <div className="login-form-container">
        <Title>Đăng nhập</Title>
        <Form
          name="login"
          initialValues={{
            remember: true,
          }}
          style={{
            width: "100%",
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Nhập Email!",
              },
              {
                type: "email",
                message: "Email không đúng định dạng!",
              },
            ]}
          >
            <Input 
              className="input-box" 
              size="large" 
              prefix={<MailOutlined />} 
              placeholder="Email" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Nhập mật khẩu!",
              },              
            ]}
          >
            <Input.Password
              className="input-box"
              size="large"
              prefix={<LockOutlined />}
              type="password"
              placeholder="Mật khẩu"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item>
           <Flex justify="center">
           <Button className="login-btn" block type="primary" htmlType="submit">
              Đăng nhập
            </Button>
           </Flex>
          </Form.Item>
        </Form>
      </div>
  );
}

export default LoginForm;
