import React, { useEffect, useState, useRef, useContext } from "react";
import { Row, Table, Modal, Spin, Input, Space, Button, Tag, Switch, Layout, Menu,} from "antd";
import { SearchOutlined, SettingOutlined} from "@ant-design/icons"
import axios from "axios";
import Details from "./Details";
import Highlighter from 'react-highlight-words'
import { displayPartsToString } from "typescript";
import Papa from 'papaparse';
import exportCSV from "./exportCSV"
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import {EnvironmentContext} from "../Context/AppProvider";
const _ = require(`lodash`)

// interface PromoObj {
//   id: string;
//   promoCodeID: string;
//   code: string;
//   status: boolean;
//   discount: number;
  
// }




function Home() {
  const { isLocal } = useContext(EnvironmentContext);
  const [promoObj, setPromoObj] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [defaultKey, setdefaultKey] = useState(1)
  const { Header, Content, Footer } = Layout;

  console.log(useContext(EnvironmentContext))

  useEffect(() => {
    setIsFetching(true)
    axios({
      method: 'get',
      url: (()=>{
        if(isLocal){
          return 'http://localhost:8000/fetchPromoCode'
        }
        return '/fetchPromoCode'
      })(),
      withCredentials: true
    })
      .then((response) => {
        console.log(response.data);
        setPromoObj(response.data); 
        setIsFetching(false)
      })
      .catch((err) => {
        console.error(err);
      })
  }, []);
  const getColumnSearchProps = (dataIndex, title) => ({
        
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
        //   onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : [])
                debouncedSearch(e.target.value, confirm, dataIndex)
            } }
            // onChange={_.debounce(()=>handleSearch(selectedKeys, confirm, dataIndex), 300)}
          onPressEnter={() => handleSearch2(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
                handleSearch2(selectedKeys, confirm, dataIndex)
                } }
            icon={<SearchOutlined style={{justifySelf:"center"}}/>}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
              onClick={() => clearFilters && handleReset(clearFilters, selectedKeys, confirm, dataIndex)}
              size="small"
              style={{
                width: 90,
              }}
            >
            Clear
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
            //   setgetColumnSearchProps(dataIndex);
            }}
          > 
            Filter
          </Button>  */}
         {/* <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>  */}
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : 'black',
          fontSize: "25px",
          fontWeight:"bold",
          marginLeft: "-10px"
        }}
      />
    ),
    onFilter: (value, record) =>{
      return record[dataIndex] !== null && record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
        if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      getColumnSearchProps === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  
  const columns = [

    {
        title: 'Promo Code ID',
        dataIndex: 'promoCodeID',
        width: 300,
        render: (text,record,index) => <a onClick={()=>handleClick(index)}>{text}</a>,
        align: "center"
    },
    {
      title: 'Promo Code',
      dataIndex: 'code',
      key: 'code',
      align: "center"
      
    },
    {
      title: 'Discount',
      render: (text, record) => record.percent_off + "%",
      align: "center"
    },
    // {
    //   title: 'Redemptions',
    //   render: (text, record) => record.times_redeemed
    // },
    {
      title: 'Status',
      render: (text, record, {tags}) => (record.status === "true" ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>),
      align: "center"
    },
    {
      title: 'Date Created',
      render: (text, record, {tags}) => {
        const newDate = new Date(record.date * 1000)
        return newDate.toLocaleDateString()
      },
      align: "center"
    },
      {
      title: 'Redemptions',
      key: 'redemptions',
      render: (text, record) => record.times_redeemed,
      align: "center"
    },
    {
      ...getColumnSearchProps('code', 'Promo Code'),
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

  const debouncedSearch = _.debounce((selectedKeys, confirm, dataIndex) => {
    confirm({ closeDropdown: false});
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
      
    }, 300);

  const handleSearch2 = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex) => {
    clearFilters();
    setSearchText('');
    confirm();
    setSearchedColumn('');
};

  const handleClick = (index) =>{ 
    setSelectedPromo(promoObj[index]);
    setOpenModal(true)
  }

  const closeModal = () =>{
    setOpenModal(false)
    setdefaultKey(1)

  }


    // Sample JSON data
   
  
    const downloadCSV = (promoObj) => {

      const csv = Papa.unparse(promoObj);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute("download", "data.csv");
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
  
  return (
    <> 
   
      
          <Row justify="center"><h1>Promo Codes</h1></Row>
          <Row justify="center" align="top">
            <Spin spinning={isFetching}>
              <Table
                scroll={{
                  x: 800,
                }}
                size="large"
                style={{ width: "50vw" }}
                columns={columns}
                dataSource={promoObj}
                rowKey="id" 
                footer= {()=>
                <Row justify={'end'}>  
                  <Button type="primary" style={{backgroundColor:"green"}} onClick={()=>exportCSV(promoObj)}>Export to CSV</Button>
                </Row>
                }
                pagination = {{
                  pageSize: 12
                }}
              />
        
            </Spin>
          </Row>
      
      <Modal open={openModal} onCancel={closeModal} width={"80vw"} footer={null}>
       <Details selectedPromo={selectedPromo}/>
      </Modal>
    
    </>
  );
}

export default Home;
