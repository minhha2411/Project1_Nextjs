"use client";
import React, { useState } from "react";

import { Button, Col, Input, Row } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axiosInstance from "../api/axiosConfig";
import { useRouter } from "next/navigation";

function Login() {
  const router = useRouter();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Required"),

    // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    // Minimum eight characters, at least one letter and one number:
    password: Yup.string()
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: "Minimum eight characters, at least one letter and one number",
      })
      .required("Required"),
  });

  const handleSubmit = async (email: string, password: string) => {
    try {
      const result = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      console.log(result, "result");
      if (result.status == 201) {
        localStorage.setItem("accessToken", result?.data?.access_token);
        localStorage.setItem("refreshToken", result?.data?.user?.refreshToken);

        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[500] h-[500] flex flex-col justify-center items-center">
        <h1 className="flex justify-center mb-5 text-2xl">Login Form</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values) => {
            console.log("Form values:", values);
            await handleSubmit(values.email, values.password);
          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => {
            if (Object.keys(errors).length > 0) {
              console.log("Current errors:", errors);
            }
            return (
              <Form onSubmit={handleSubmit} className="w-full h-full">
                <Row gutter={[0, 16]}>
                  <Col className="gutter-row" span={24}>
                    <Input
                      placeholder="UserName"
                      name="email"
                      onChange={handleChange}
                      value={values.email}
                    />
                    {errors.email && touched.email ? (
                      <div className="text-red-400 mt-1">{errors.email}</div>
                    ) : null}
                  </Col>
                  <Col className="gutter-row" span={24}>
                    <Input
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                      value={values.password}
                    />
                    {errors.password && touched.password ? (
                      <div className="text-red-400  mt-1">
                        {errors.password}
                      </div>
                    ) : null}
                  </Col>
                  <Col className="gutter-row " span={24}>
                    <div className="flex justify-center">
                      <Button
                        className="bg-red-500 text-white"
                        htmlType="submit"
                        type="primary"
                      >
                        Sign In
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
