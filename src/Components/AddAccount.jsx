import React, {useState} from 'react'
import { Alert, Button, Input, Layout, Row, Card, Typography, Flex, Checkbox, Modal, Form, Space } from 'antd'
import axios from "axios";

function AddAccount(props) {
    const {openAddAccountModal, setOpenAddAccountModal, fetchData} = props
    const [form] = Form.useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const initialValues = {
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    }

    const AddAccount = () =>{
        setIsLoading(true)
        axios({
            method: 'post',
            url: 'http://localhost:8000/manuallyAddAccount',
            data: form.getFieldValue(),
            withCredentials: true
        })
        .then((response)=>{
            console.log("Success",response)
            fetchData()
            setOpenAddAccountModal(false)
            setIsLoading(false)
            form.resetFields()

        })
        .catch((err)=>{
            console.error(err)
        })
    } 

    return (
        <Modal open={openAddAccountModal} footer={null} closable={false}>
            <Form
                initialValues={initialValues}
                // onFinish={handleSubmit}
                labelAlign={'right'}
                labelCol={{ span: 7 }}
                form={form}
                style={{ display: "grid" }}>

                <Form.Item
                    name='fullName'
                    label='Full Name'
                    required='true'
                    style={{ marginBottom: "0px" }}>
                    <Form.Item
                        name='firstName'
                        style={{ display: 'inline-block', width: 'calc(50% - 8px' }}
                        rules={[{ required: true, message: 'First name required!' }]}>
                        <Input placeholder='First name' />
                    </Form.Item>

                    <Form.Item
                        name='lastName'
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                        rules={[{ required: true, message: 'Last name required!' }]}>
                        <Input placeholder='Last name' />
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    name='username'
                    label='Username'
                    rules={[
                        { required: true, message: 'Please provide a username.' },
                        {
                            validator: (_, username) => {
                                const reservedWords = ["admin", "root", "superuser", "system"];
                                const usernameRegex = /^(?!.*[_.]{2})[a-zA-Z0-9][a-zA-Z0-9._]{1,18}[a-zA-Z0-9]$/;
                                if (username.length < 4) {
                                    return Promise.reject("Username must be greater than 3 characters!");
                                }
                                if (!usernameRegex.test(username)) {
                                    return Promise.reject("Invalid username! Use only letters, numbers, dots, and underscores. No consecutive dots or underscores. Dots or underscore can't be the start or end of the username.");
                                }
                                if (reservedWords.includes(username.toLowerCase())) {
                                    return Promise.reject(`"${username}" is a reserved word and cannot be used as a username.`);
                                }

                                return Promise.resolve();
                            }
                        },

                    ]}>
                    <Input placeholder='Username' />
                </Form.Item>


                <Form.Item name='email'
                    label='Email'
                    rules={[{ required: true, message: 'The activation key is sent in this email so it is important to have a valid email address entered here.' }, { type: 'email', message: 'Invalid email!' }]}>
                    <Input placeholder='test@example.com' />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            validator: (_, password) => {
                                let uppercaseCheck = /(?=.*[A-Z])/
                                if (!password.match(uppercaseCheck)) {
                                    return Promise.reject(new Error("At least one uppercase letter"));
                                }
                                return Promise.resolve()
                            }
                        },
                        {
                            validator: (_, password) => {
                                let lowercaseCheck = /(?=.*[a-z])/
                                if (!password.match(lowercaseCheck)) {
                                    return Promise.reject(new Error("At least one lowercase letter"));
                                }
                                return Promise.resolve()
                            }
                        },
                        {
                            validator: (_, password) => {
                                let digitCheck = /(?=.*[0-9])/
                                if (!password.match(digitCheck)) {
                                    return Promise.reject(new Error("At least one number"));
                                }
                                return Promise.resolve()
                            }
                        },
                        {
                            validator: (_, password) => {
                                let minCheck = /(?=.{8,})/
                                if (!password.match(minCheck)) {
                                    return Promise.reject(new Error("Minimum 8 characters"));
                                }
                                return Promise.resolve()
                            }
                        }
                    ]}
                    hasFeedback
                >
                    <Input.Password autoComplete='new-password' placeholder='Password' />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder='Confirm Password' />
                </Form.Item>
                
                <Form.Item
                    name="country"
                    label="Country"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: 'Please confirm your password!',
                    //     },
                        // ({ getFieldValue }) => ({
                        //     validator(_, value) {
                        //         if (!value || getFieldValue('password') === value) {
                        //             return Promise.resolve();
                        //         }
                        //         return Promise.reject(new Error('The new password that you entered do not match!'));
                        //     },
                        // }),
                    //]}
                >
                    <Input placeholder='Country' />
                </Form.Item>
                {/* <Form.Item
                    name="consent"
                    valuePropName="checked"
                    required='true'
                    label=""
                    style={{ justifySelf: "center" }}
                >
                    <Checkbox required='true'>
                        <Typography.Text type='secondary'>
                            I have read and agree to the <a href="/terms-and-conditions" target='_blank' rel="noreferrer">Terms and Conditions</a> and
                            <a href="/privacy-policy" target='_blank' rel="noreferrer" style={{ textDecoration: "none" }}> Privacy Policy</a>.
                        </Typography.Text>
                    </Checkbox>
                </Form.Item> */}
                <Space direction='vertical'>
                    <Button loading={isLoading} htmlType='submit' type='primary' size='medium' block onClick={()=>AddAccount()}>Manually Add Account</Button>
                    <Button type='primary' size='medium' danger block onClick={()=>setOpenAddAccountModal(false)}>Cancel</Button>
                </Space>
                 {/* {errorMessage !== null ? (
                    <Alert
                        style={{ margin: '24px 0' }}
                        description={errorMessage}
                        type='error'
                        showIcon
                    />
                ) : null} */}
            </Form>
        </Modal>
    )
}

export default AddAccount