import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { loginThunk } from "../../redux/thunk/authThunk";
import { useDispatch } from "react-redux";

export default function Login() {
  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(loginThunk(values));
  };

  return (
    <div className="min-h-[calc(100vh-134px)] py-4 px-4 sm:px-12 flex justify-center items-center ">
      
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h1 className="text-xl font-medium pb-5 text-center">Login Admin</h1>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
          hasFeedback
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button bg-red-600"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
