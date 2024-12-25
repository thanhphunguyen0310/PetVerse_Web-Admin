import { useEffect, useState } from 'react'
import { HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { MdOutlinePets } from "react-icons/md";
import { GiPawHeart } from "react-icons/gi";
import { useSelector } from 'react-redux';
import { managerCardOverview } from '../../configs/api/dashboard';
import { Card, Col, Row } from 'antd';
import './ManagerCardOverview.css'

const cardStyles = {
    totalPet: { 
        backgroundColor: "#E3F2FD", 
        iconColor: "#1565C0", 
        icon: <MdOutlinePets /> 
      },
      totalPetCenter: { 
        backgroundColor: "#E8F5E9", 
        iconColor: "#388E3C", 
        icon: <HomeOutlined /> 
      },
      totalPetCenterService: { 
        backgroundColor: "#FFF9C4", 
        iconColor: "#F57C00", 
        icon: <ShoppingCartOutlined /> 
      },
      toTalCenterBreed: { 
        backgroundColor: "#FCE4EC", 
        iconColor: "#D81B60", 
        icon: <GiPawHeart /> 
      }
  };
const ManagerCardOverview = () => {
    const { accessToken } = useSelector((state) => state?.auth)
    const [overViewData, setOverViewData] = useState();
  
    useEffect(() => {
      const fetchCardData = async () => {
        try {
          const response = await managerCardOverview(accessToken);
          setOverViewData(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchCardData();
    }, [])
  return (
    <Row gutter={[16, 16]} wrap>
    {overViewData && (
      <>
         <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card className="dashboard-card"
            style={{ backgroundColor: cardStyles.totalPet.backgroundColor }}
            bordered={false}
            title={<div className="card-title" style={{ color: cardStyles.totalPet.iconColor }}>
              Số lượng thú cưng
            </div>}
          >
            <div className="card-content" style={{ color: cardStyles.totalPet.iconColor }}>
              <span>{overViewData.totalPet}</span>
              {cardStyles.totalPet.icon}
            </div>
          </Card>
        </Col>

         <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card className="dashboard-card"
            style={{ backgroundColor: cardStyles.totalPetCenter.backgroundColor }}
            bordered={false}
            title={<div className="card-title" style={{ color: cardStyles.totalPetCenter.iconColor }}>
              Số lượng trung tâm
            </div>}
          >
            <div className="card-content" style={{ color: cardStyles.totalPetCenter.iconColor }}>
              <span>{overViewData.totalPetCenter}</span>
              {cardStyles.totalPetCenter.icon}
            </div>
          </Card>
        </Col>

         <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card className="dashboard-card"
            style={{ backgroundColor: cardStyles.totalPetCenterService.backgroundColor }}
            bordered={false}
            title={<div className="card-title" style={{ color: cardStyles.totalPetCenterService.iconColor }}>
              Đăng ký trung tâm
            </div>}
          >
            <div className="card-content" style={{ color: cardStyles.totalPetCenterService.iconColor }}>
              <span>{overViewData.totalApplicationInMonth}</span>
              {cardStyles.totalPetCenterService.icon}
            </div>
          </Card>
        </Col>

         <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card className="dashboard-card"
            style={{ backgroundColor: cardStyles.toTalCenterBreed.backgroundColor }}
            bordered={false}
            title={<div className="card-title" style={{ color: cardStyles.toTalCenterBreed.iconColor }}>
              Giống mới
            </div>}
          >
            <div className="card-content" style={{ color: cardStyles.toTalCenterBreed.iconColor }}>
              <span>{overViewData.toTalCenterBreed}</span>
              {cardStyles.toTalCenterBreed.icon}
            </div>
          </Card>
        </Col>
      </>
    )}
  </Row>
  )
}

export default ManagerCardOverview