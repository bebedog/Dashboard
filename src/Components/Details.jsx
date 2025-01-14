import React,{ Children, useEffect, useState, useContext } from "react";
import Axios from "axios";
import { Table, Spin, Row, Button, Tabs, message, Typography, Modal } from "antd";
import { EnvironmentContext } from "../Context/AppProvider";
import exportCSV from './exportCSV'

// interface PromoObj {
//     id: string;
//     promoCodeID: string;
//     code: string;
//     status: boolean;
//     discount: number;
    
//   }
// interface DetailsProps {
//     promoObj: PromoObj[];  // Define the expected prop type
//   }

const Details = (selectedPromo) => {
  const { isLocal } = useContext(EnvironmentContext);
  const [transactionPromo, setTransactionPromo] = useState(null)
  const [isFetching, setIsFetching] = useState(null)
  let {promoCodeID, code, percent_off} = selectedPromo.selectedPromo
  const [ forArchive, setForArchive] = useState([])
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openModal, setOpenModal] = useState(false)
  
  let proms = null

  
  useEffect(()=>{
      fetchPromoTransactions()
  }, [selectedPromo]);

  const fetchPromoTransactions = () =>{
    setIsFetching(true)
    Axios({
      method: 'post',
      url: isLocal ? 'http://localhost:8000/fetchPromoTransactions' : 'api/fetchPromoTransactions' ,
      data: {promoCodeID: promoCodeID},
      withCredentials: true,
      })
      .then((response) => {
        setTransactionPromo(response.data)
        setIsFetching(false)
        setSelectedRowKeys([]);
        setForArchive([])
      })
      .catch((err) => {
        console.error(err);
      });
  }
       
  const handleArchive =()=>{
    console.log("for", forArchive.length)
    if(forArchive.length !== 0){
      setIsFetching(true)
      Axios({
        method: 'post',
        url: isLocal ? 'http://localhost:8000/archive' : 'api/archive',
        withCredentials: true,
        data: {forArchive: forArchive}
      })
      .then((res)=>{
        setIsFetching(false)
        fetchPromoTransactions(); 
        success()
        setOpenModal(false)
      })
      .catch((err)=>{
        console.error(err)
      })
    }
    else{
      console.log("empty")
    }
  }


  proms = transactionPromo?.filter((transaction) => transaction.archived !== true) 
  .map((promo, index) => ({
      payload: promo.payload,
      key: index
  }));
     
  let archivedProms = transactionPromo?.filter((transaction) => transaction.archived === true) 
  .map((promo, index) => ({
      payload: promo.payload,
      key: index
  }));
  
  let numberOfPurchases = transactionPromo?.length

  const onSelectChange = (newSelectedRowKeys, selectedRows2) => {
    console.log('selectedRowKeys changed: ', selectedRows2);
    setSelectedRowKeys(newSelectedRowKeys);
    setForArchive(selectedRows2)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // onChange: (selectedRowKeys, selectedRows2) => {
    //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows2);
    //   setForArchive(selectedRows2)
    // },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Success! Your selected transaction(s) are now archived.',
    });
  };

  const handleOpenModal = () =>{
    if(selectedRowKeys.length !== 0){
      setOpenModal(true)
    }
  }


  return(
    <Spin spinning={isFetching}>
    {contextHolder}
      <Row justify={'start'}><h3>Promotion Code: {code} ({percent_off}%)</h3></Row>
      <Row justify={'start'} style={{marginTop:"-30px"}}><h4>Redemptions: {numberOfPurchases}</h4></Row>
        <Tabs
         
          items={[{
            key: 1,
            label:'Transactions',
            children: 
            <>
            <Table 
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                scroll={{
                  x: 800,
                }}
              columns={[
                {
                title: '',
                dataIndex: '',
                render: (text,record,index) => index+1
                },
                {
                  title: "Customer",
                  render: (text, record) => record.payload.customer_details.name
                },
                {
                  title: "Email",
                  render: (text, record) => record.payload.customer_details.email
                },
                {
                  title: "Product",
                  render: (text, record) => record.payload.metadata.description
                },
                {
                  title: "Amount Subtotal",
                  render: (text, record) => {
                    const formattedAmount = (record.payload.amount_subtotal/ 100).toFixed(2)
                    return record.currency === 'gbp' ? `£${formattedAmount}` : record.payload.currency === 'eur' ? `€${formattedAmount}` : `$${formattedAmount}`
                  }
                },
                {
                  title: "Amount Total",
                  render: (text, record) => {
                    const formattedAmount =  (record.payload.amount_total/ 100).toFixed(2)
                    return record.currency === 'gbp' ? `£${formattedAmount}` : record.payload.currency === 'eur' ? `€${formattedAmount}` : `$${formattedAmount}`
                  }
                },
                {
                  title: "Discounted Amount ",
                  width: 200,
                  render: (text, record) => {        
                    const formattedAmount =  (record.payload.total_details.amount_discount/100).toFixed(2)
                    return record.currency === 'gbp' ? `£${formattedAmount}` : record.payload.currency === 'eur' ? `€${formattedAmount}` : `$${formattedAmount}`
                  }
                },
                {
                  title: "Date",
                  render: (text, record) => {        
                    const newDate = new Date(record.payload.created * 1000)
                    return newDate.toLocaleDateString()
                  }
                },
              ]}

            dataSource={proms} 
            footer= {()=>
            <Row justify={'end'}>  
             <Button type="primary" style={{backgroundColor:"green"}} onClick={()=>exportCSV(proms)}>Export to CSV</Button>
              <Button type='primary' onClick={()=>handleOpenModal()}>Archive</Button>
            </Row>
            }
            >
            </Table>
            <Modal 
              open={openModal} 
              onOk={()=>handleArchive()} 
              onCancel={()=>setOpenModal(false)}
              title="Confirm Archive"
              >
              {selectedRowKeys.length === 1 ?  "Are you sure you want to archive this item?" :  `Are you sure you want to archive these  (${selectedRowKeys.length}) items?`}
            
            </Modal>
          </>
            
          },{
            key: 2,
            label:'Archived',
            children: 
            <>
           
            <Table 
                scroll={{
                  x: 800,
                }}
              columns={[
                {
                title: '',
                dataIndex: '',
                render: (text,record,index) => index+1
                },
                {
                  title: "Customer",
                  render: (text, record) => record.payload.customer_details.name
                },
                {
                  title: "Email",
                  render: (text, record) => record.payload.customer_details.email
                },
                {
                  title: "Product",
                  render: (text, record) => record.payload.metadata.description
                },
                {
                  title: "Amount Subtotal",
                  render: (text, record) => {
                    const formattedAmount = (record.payload.amount_subtotal/ 100).toFixed(2)
                    return record.currency === 'gbp' ? `£${formattedAmount}` : record.payload.currency === 'eur' ? `€${formattedAmount}` : `$${formattedAmount}`
                  }
                },
                {
                  title: "Amount Total",
                  render: (text, record) => {
                    const formattedAmount =  (record.payload.amount_total/ 100).toFixed(2)
                    return record.currency === 'gbp' ? `£${formattedAmount}` : record.payload.currency === 'eur' ? `€${formattedAmount}` : `$${formattedAmount}`
                  }
                },
                {
                  title: "Discounted Amount ",
                  width: 200,
                  render: (text, record) => {        
                    const formattedAmount =  (record.payload.total_details.amount_discount/100).toFixed(2)
                    return record.currency === 'gbp' ? `£${formattedAmount}` : record.payload.currency === 'eur' ? `€${formattedAmount}` : `$${formattedAmount}`
                  }
                },
                {
                  title: "Date",
                  render: (text, record) => {        
                    const newDate = new Date(record.payload.created * 1000)
                    return newDate.toLocaleDateString()
                  }
                },
                // {
                //   title:"Archive",
                //   render:(text, record) =>{
                //     return <Button>Archive</Button>
                //   }
                // }
                
              ]}

            dataSource={archivedProms} 
            // footer= {()=>
            // <Row justify={"end"}>  
            //   <Button onClick={()=>handleArchive()}>Archive</Button>
            // </Row>
            // }
            >
            </Table>
            <Row>
             <Typography.Text type="secondary" italic>Archived</Typography.Text>
            </Row>
          </>

          }]}
          >
         
        </Tabs>
      
      
    </Spin>
    )
}

export default Details