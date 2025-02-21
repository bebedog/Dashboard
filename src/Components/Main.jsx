import React, {useState} from 'react';
import { Row, Button, Space } from 'antd';
import { 
    BtnBold,
    BtnBulletList,
    BtnClearFormatting,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnRedo,
    BtnStrikeThrough,
    BtnStyles,
    BtnUnderline,
    BtnUndo,
    HtmlButton,
    Separator,
    Toolbar,
    EditorProvider,
    Editor,

  } from 'react-simple-wysiwyg';
import DocumentTemplater from './Download';

function Main(){
    const [value, setValue] = useState('');

    function onChange(e) {
      setValue(e.target.value);
    }
    return (
        <>
        <Row justify={'center'}>
            <h1>
                Send Email
            </h1>
        </Row>
        <Row justify={'center'}>
            <Space direction='vertical' justify={"center"} style={{width:"50%"}}>
                <div style={{width:"100%", justifySelf:"center"}}>
                    <EditorProvider >
                        <Editor value={value} onChange={onChange} >
                            <Toolbar>
                                <BtnUndo />
                                <BtnRedo />
                                <Separator />
                                <BtnBold />
                                <BtnItalic />
                                <BtnUnderline />
                                <BtnStrikeThrough />
                                <Separator />
                                <BtnNumberedList />
                                <BtnBulletList />
                                <Separator />
                                <BtnLink />
                                <BtnClearFormatting />
                                <HtmlButton />
                                <Separator />
                                <BtnStyles />
                            </Toolbar>
                        </Editor>
                    </EditorProvider>
                </div>
                <Row justify={"center"}>
                    <Button block type='primary'>Send Email</Button>
                </Row>
            </Space>
        </Row>
        {/* <Row justify={"center"}>
            <DocumentTemplater />
        </Row> */}

        </>
      );
}

export default Main