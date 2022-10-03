import React from 'react';
import {Loading3QuartersOutlined} from "@ant-design/icons";
import {Spin} from "antd";

const Loader = () => {
    return (
        <Spin
            indicator={<Loading3QuartersOutlined style={{fontSize: 30}} spin/>}
            style = {{display: 'block', textAlign: 'center', marginTop: 30}}
        />
    );
};

export default Loader;