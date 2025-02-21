import React, { useEffect, useState, useRef, useContext } from "react";
import { Row, Table, Modal, Spin, Input, Space, Button, Tag, Pagination, Form, InputNumber, Popconfirm, Badge } from "antd";
import { PlusOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { SearchOutlined, SettingOutlined} from "@ant-design/icons"
import axios from "axios";
import Details from "./Details";
import Highlighter from 'react-highlight-words'
import { displayPartsToString } from "typescript";
import Papa from 'papaparse';
import exportCSV from "./exportCSV"
import { EnvironmentContext } from "../Context/AppProvider";
import { useForm } from "antd/es/form/Form";
const _ = require(`lodash`)



const Accounts = () =>{
    const { isLocal } = useContext(EnvironmentContext);
    const [allUsers, setAllUsers] = useState(null)
    const [isFetching, setIsFetching] = useState(false)
    const [refreshToken, setRefreshToken] = useState([])
    const [calcs, setCalcs] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [userObj, setUserObj] = useState([])
    const [openConfirm, setOpenConfirm] = useState(false)
    const [ loading, setLoading] = useState(false)
    const [ loading2, setLoading2] = useState(false)
    const [ loading3, setLoading3] = useState(false)
    const [form] = Form.useForm()
    const [desc, setDesc] = useState(0)
    let con = useContext(EnvironmentContext)
    const [dex, setDex] = useState()
    

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        setIsFetching(true); // Set fetching state to true initially
        try {
            // Perform both requests concurrently
            const [usersResponse, calcsResponse, refreshTokenResponse] = await Promise.all([
                axios({
                    method: 'get',
                    url: isLocal ? 'http://localhost:8000/fetchAllUsers' : 'api/fetchAllUsers',
                    withCredentials: true,
                }),
                axios({
                    method: 'get',
                    url: isLocal ? 'http://localhost:8000/fetchAllCalculations' : 'api/fetchAllCalculations',
                    withCredentials: true,
                }),
                axios({
                    method: 'get',
                    url: isLocal ? 'http://localhost:8000/fetchRefreshToken' : 'api/fetchRefreshToken',
                    withCredentials: true,
                }),
            ]);

            // Handle responses
            console.log("Users:", usersResponse.data.data);
            setAllUsers(usersResponse.data.data);

            console.log("Calculations:", calcsResponse.data);
            setCalcs(calcsResponse.data);

            console.log("Refresh", refreshTokenResponse.data)
            setRefreshToken(refreshTokenResponse.data)
        } catch (error) {
            console.error("Error fetching data1:", error);
        } finally {
            setIsFetching(false); 
        }
    };

    const revokeAll = (accountID) =>{
        setLoading3(true)
        axios({
            method: "put",
            url: isLocal ? 'http://localhost:8000/revokeAll' : 'api/revokeAll',
            data: {accountID: accountID},
            withCredentials: true
        })
        .then((response)=>{
            fetchData()
            .then(()=>{
                setLoading3(false)
            })
        })
        .catch((err)=>{
            console.error(err)
        })
    }

    const revokeSpecific = (refreshID) =>{
        console.log(refreshID)
        setLoading3(true)
        axios({
            method: "put",
            url: isLocal ? 'http://localhost:8000/revokeSpecific' : 'api/revokeSpecific',
            data: { refreshID: refreshID },
            withCredentials: true
        })
        .then((response)=>{
            console.log(response)
            fetchData()
            .then(()=>{
                setLoading3(false)
            })
        })
        .catch((err)=>{
            console.error(err)
        })
       

    }

      console.log("calcs2", calcs)
 
      const dataSource = allUsers?.map((user, index) => {
          const userCalcs = calcs?.find(calc => Number(calc.owner) === user.accountID) || {}; 
          const filterUserRefreshToken = refreshToken?.filter(refresh => Number(refresh.owner) === user.accountID) || {}; 
            const userRefreshToken = filterUserRefreshToken?.map((token, index)=>{
                return token
            })
        return {
            id: index,
            allUser: user,
            calcs: userCalcs, 
            refreshToken: userRefreshToken
        };
    });
    

    console.log("tok", dataSource)

    const columns = [

        {
            title: 'Name',
            // dataIndex: 'username',
            width: 200,
            render: (text,record, index, pagination) => <a onClick={()=>handleOpen(record.id)}>{record.allUser.firstName} {record.allUser.lastName}</a>
        },
        {
            title: 'Username',
            dataIndex: 'username',
            width: 200,
            render: (text,record,index) => record.allUser.username
        },
        {
            title: 'Email',
            dataIndex: 'emailAddress',
            width: 200,
            render: (text,record,index) =>  record.allUser.emailAddress
        },
        {
          title: 'Number of Calculations ',
          render: (text, record) => record.calcs.issubscribed ? <Tag color="#F7B306">Subscribed</Tag> : record.calcs.numberofcalculations ? record.calcs.numberofcalculations : <Tag>No Calculation Data</Tag>
        },
        {
            title: "Activation Code",
            render: (text, record) => record.allUser?.confirmationCode

        },
        {
            title: 'Status',
            render: (text, record) => record.allUser.active ?  <Tag color="green">Active</Tag> : <Tag color="red">Not Activated</Tag>
        },
        // {
        //   title: 'Pre Authorized',
        //   render: (text, record) => record.calcs.isPreAuthorized ?  <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
        // },
        // {
        //   title: 'Action',
        //   render: (text, record, {tags}) => (
        //   <Row>
        //     <Button type="primary" danger >Revoke Login</Button>
        //     {/* <Button>Revoke Login</Button> */}
        //   </Row>)
          
        // },
        {
        //   ...getColumnSearchProps('code', 'Promo Code'),
          width: 5
        }
        // {
        //   title: 'Discount',
        //   dataIndex: 'discount',
        //   key: 'discount',
        //   render: (discount: number) => `${discount}%`
        // },
        // {
        //   title: 'Status',
        //   dataIndex: 'status',
        //   key: 'status'
        // }
      ];

    const colums2 = []

    const handleOpen=(index, pageSize)=>{
        setOpenModal(true)
        setUserObj(dataSource[index])
        form.resetFields()
        setDex(index)
    }

    const handleManuallyActivate = (accountID)=>{
        setLoading(true)
        axios({
            method: 'post',
            url: isLocal ? 'http://localhost:8000/manuallyActivateAccount' : 'api/manuallyActivateAccount',
            data: {accountID: accountID},
            withCredentials: true
        })
        .then((res)=>{
            console.log(res)
            setLoading(false)
            setOpenConfirm(false)
            

        })
        .catch((err)=>{console.log(err)})
        .finally(()=>{
            setOpenModal(false)
            fetchData()

        })
    }

    const handleSubmit = (accountID) =>{
        setLoading2(true)
        console.log(form.getFieldValue(), accountID)
        const addCalculation = form.getFieldValue()
        axios({
            method: 'post',
            url: isLocal ? 'http://localhost:8000/manuallyAddCalculations' : 'api/manuallyAddCalculations',
            data: {accountID: accountID, ...addCalculation },
            withCredentials: true
        })
        .then(()=>{ 
            fetchData()
            setOpenModal(false)
        })
        .catch((err)=>{
            console.error(err)
        })

    }


    return(
        <>
        {/* <Row justify="center"><h1>RealTime LSS Accounts </h1></Row> */}
        <Row justify="center" align="top">
          <Spin spinning={isFetching}>
            {dataSource ? (
                <>
              <Table
              scroll={{
                  x: 800,
              }}
              size="large"
              style={{ width: "90vw" }}
              columns={columns}
              dataSource={dataSource}
              rowKey="id" 
              title={()=><Row justify={'space-between'} align={"middle"}><h3>Manage Accounts</h3> <div><Button type="primary">Manually Add Account</Button></div></Row>}
              footer= {()=>
              <Row justify={'end'}>  
                  {/* <Button type="primary" style={{backgroundColor:"green"}} onClick={()=>exportCSV(promoObj)}>Export to CSV</Button> */}
              </Row>
              }
              />

            <Modal 
                closable={false}
                open={openModal} 
                onCancel={()=>setOpenModal(false)}
                footer={null}
                title={
                <Row justify={'space-between'}>
                    {`${userObj?.allUser?.firstName || ""} ${userObj?.allUser?.lastName || ""}`} 
                    {!userObj?.allUser?.active  && <Tag color="red" style={{marginLeft:"8px"}}>Not Activated</Tag>} 
                </Row> 
                }
                width={1300}
                >
                <Spin spinning={loading3}>
                    <div style={{minHeight:"150px"}}>
                        <Row>
                            Date Added: {userObj?.allUser?.dateAdded}
                        </Row>
                        {!userObj?.calcs?.issubscribed ? (
                            
                            <>
                                <Row>
                                    Number of Calculations: {userObj?.calcs?.numberofcalculations}
                                </Row>
                                <Row>
                                    {userObj?.calcs?.numberofcalculations ? (
                                                        <Form name="addCalculation" form={form} onFinish={() => handleSubmit(userObj?.allUser?.accountID)} style={{ width: "100%" }}>
                                                            <Form.Item label="Add Calculations">
                                                                <Form.Item name="addCalculations" noStyle>
                                                                    <InputNumber title="Add Calculations" key={userObj?.allUser?.accountID} min={0} defaultValue={0} />
                                                                </Form.Item>

                                                                <Popconfirm
                                                                    onConfirm={() => form.submit()}
                                                                    loading={loading2}
                                                                    title="Add Calcualtions"
                                                                    onClick={() => setDesc(form.getFieldValue('addCalculations'))}
                                                                    onCancel={() => setDesc(0)}
                                                                    description={`Are you sure you want to add ${desc} to ${userObj?.allUser?.firstName}'s account?`}
                                                                >
                                                                    <Button type="primary" shape="circle" icon={<PlusOutlined />}></Button>
                                                                </Popconfirm>

                                                            </Form.Item>
                                                        </Form>
                                    ) : "No Calculation data"}
                                </Row>
                            </>
                        ): <Tag color="#F7B306">Subscribed</Tag>
                        }
                        <Row> 
                            <Table 
                                columns={[
                                    {
                                        title: "ID", 
                                        width: 150,
                                        render: (record)=> record.id
                                    },
                                    {
                                        title: "Refresh Token", 
                                        width: 1000,
                                        render: (record)=> record.refreshToken
                                    },
                                    {
                                        title: "Status", 
                                        width: 100,
                                        render: (record)=> record.revoked ? "Revoked" : "Active"
                                    },
                                    {
                                        title:  <Popconfirm
                                                    onConfirm={() => revokeAll(userObj.allUser.accountID)}
                                                    loading={loading3}
                                                    title="Revoke All Refresh Tokens"
                                                    description={`Are you sure you want to revoke all of ${userObj?.allUser?.firstName}'s refresh token?`}
                                                >
                                                    <Button type="primary" danger>Revoke All</Button>
                                                </Popconfirm>,
                                        align: "center",
                                        width: 150,
                                        render: (record)=> 
                                            !record.revoked && 
                                            <Popconfirm
                                                    onConfirm={() => revokeSpecific(record.id)}
                                                    loading={loading3}
                                                    title="Revoke Refresh Token"
                                                    description={`Are you sure you want to revoke this refresh token?`}
                                                >
                                                <Button type="primary" danger>Revoke</Button>
                                            </Popconfirm>
                                    },
                                ]} 
                                dataSource={dataSource[dex]?.refreshToken}/> 
                        </Row>
                        
                    </div>
                    {!userObj?.allUser?.active ? <Button type="primary" block style={{marginBottom:"8px"}} onClick={()=>setOpenConfirm(true)}>Manually Activate Account</Button> : "" }
                    <Button block onClick={()=>setOpenModal(false)}>Cancel</Button>
                </Spin>
            </Modal>
            <Modal 
                title={"Confirmation"}
                closable={false}
                open={openConfirm} 
                footer={
                <Row justify={'end'}>
                    <Space>
                        <Button onClick={()=>setOpenConfirm(false)}> Cancel </Button>
                        <Button onClick={()=>handleManuallyActivate(userObj.allUser.accountID)} type="primary" loading={loading}> Activate </Button>
                    </Space>
                </Row>}>
                    Are you sure you want to Activate this account?
            </Modal>
        </>) : (null)}

          </Spin>
        </Row>
       
      

        </>
    )
}

export default Accounts
