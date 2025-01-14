import React, { useEffect, useState, useRef, useContext } from "react";
import { Row, Table, Modal, Spin, Input, Space, Button, Tag, Switch, Layout, Menu,} from "antd";
import { SearchOutlined, SettingOutlined} from "@ant-design/icons"
import axios from "axios";
import Details from "./Details";
import Highlighter from 'react-highlight-words'
import { displayPartsToString } from "typescript";
import Papa from 'papaparse';
import exportCSV from "./exportCSV"
import { EnvironmentContext } from "../Context/AppProvider";
const _ = require(`lodash`)



const Accounts = () =>{
    const { isLocal } = useContext(EnvironmentContext);
    const [allUsers, setAllUsers] = useState(null)
    const [isFetching, setIsFetching] = useState(false)
    let con = useContext(EnvironmentContext)
    console.log("ag conetxt", isLocal)
    useEffect(() => {
        setIsFetching(true)
        axios({
          method: 'get',
          url: isLocal ? 'http://localhost:8000/fetchAllUsers' : 'api/fetchAllUsers',
          withCredentials: true
        })
          .then((response) => {
            console.log(response.data.data);
            setAllUsers(response.data.data); 
            setIsFetching(false)
          })
          .catch((err) => {
            console.error(err);
          })
      }, []);
    const columns = [

        {
            title: 'Name',
            // dataIndex: 'username',
            width: 200,
            render: (text,record,index) => <text>{record.firstName} {record.lastName}</text>
        },
        {
            title: 'Username',
            dataIndex: 'username',
            width: 200,
            // render: (text,record,index) => <a onClick={()=>handleClick(index)}>{text}</a>
        },
        {
            title: 'Email',
            dataIndex: 'emailAddress',
            width: 200,
            // render: (text,record,index) => <a onClick={()=>handleClick(index)}>{text}</a>
        },
        {
          title: 'Number of Calculations ',
        //   render: (text, record) => record.percent_off + "%"
        },
        {
          title: 'Last Calculation Date',
        //   render: (text, record, {tags}) => (record.status === "true" ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>) 
        },
        {
            title: 'Account Type',
          //   render: (text, record) => record.percent_off + "%"
          },
        {
          title: 'Action',
          render: (text, record, {tags}) => (
          <Row>
            <Button type="primary" danger >Revoke Login</Button>
            {/* <Button>Revoke Login</Button> */}
          </Row>)
          
        },
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
    return(
        <>
        <Row justify="center"><h1>RealTime LSS Accounts </h1></Row>
        <Row justify="center" align="top">
          <Spin spinning={isFetching}>
              <Table
              scroll={{
                  x: 800,
              }}
              size="large"
              style={{ width: "90vw" }}
              columns={columns}
              dataSource={allUsers}
              rowKey="id" 
              footer= {()=>
              <Row justify={'end'}>  
                  {/* <Button type="primary" style={{backgroundColor:"green"}} onClick={()=>exportCSV(promoObj)}>Export to CSV</Button> */}
              </Row>
              }
              />

          </Spin>
        </Row>
        </>
    )
}

export default Accounts
