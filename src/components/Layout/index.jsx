import { useState } from "react";
import { Flex, Image, Layout, Typography } from "antd";
const { Link } = Typography;
import Header from "../Header";
import SideBar from "../SideBar";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import LOGO from "../../assets/icons/petverse_logo.svg"

const { Sider, Content } = Layout;

function LayoutDefault() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
      >
        <Flex style={{flexDirection:"column", height:"100vh", gap:"16px"}}>
          <Flex
            style={{
              alignItems:"center",
              justifyContent: "center",
              width: "100%",
              height: "84px",
              borderBottom: "1px dashed black",
           }}
           className="sidebar-title"
          >
             {collapsed ? (
          <Image 
            src={LOGO} 
            width={40}
            preview={false}
            />
        ) : (
          <Typography.Title level={2} className="title"><a href="/">PetVerse</a></Typography.Title>
        )}
          </Flex>
          <SideBar collapsed={collapsed} />
        </Flex>
      </Sider>

      <Layout className="site-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            borderRadius: "4px",
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutDefault;
