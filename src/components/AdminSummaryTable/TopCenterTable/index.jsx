import { Image, Rate, Table } from 'antd';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getTopCenter } from '../../../configs/api/petCenter';
import './TopCenterTable.css'
const TopCenterTable = () => {
  const { accessToken } = useSelector((state) => state.auth)
  const [topCenterData, setTopCenterData] = useState([]);
  const topCenterColumns = [
    {
      title: "Hình ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <Image
          src={avatar}
          alt="Avatar"
          preview={false}
          width={50}
          style={{height:50, border:"1px solid", borderRadius:"50%"}}
        />
      )
    },
    {
      title: "Trung tâm",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Đánh giá",
      dataIndex: "averageRate",
      key: "averageRate",
      render: (averageRate) => {
        return (
          <Rate
            allowHalf
            disabled
            value={averageRate}
          />
        );
      },
    }    
  ];
  const fetchTopCenter = async () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    try {
      const response = await getTopCenter(accessToken, month, year);
      if (response.statusCode === 200) {
        setTopCenterData(response.data.topPetCenterDatas);
      } else {
        console.error('Failed to fetch recent transactions');
        setTopCenterData([]);
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchTopCenter();
  }, [])
  return (
    <div className="top-center-table-container">
       <h2 className="table-title">Trung tâm nổi bật</h2>
      <Table
      dataSource={topCenterData}
      columns={topCenterColumns}
      pagination={false}
      rowKey="index"
      className="custom-top-center-table"
    />
    </div>
  )
}

export default TopCenterTable