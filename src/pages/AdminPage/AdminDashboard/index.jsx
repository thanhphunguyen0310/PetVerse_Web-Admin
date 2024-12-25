import { Col, Flex, Row } from "antd"
import LineChart from '../../../components/Charts/AdminCharts/LineChart'
import PieChart from "../../../components/Charts/AdminCharts/PieChart";
import BarChart from "../../../components/Charts/AdminCharts/BarChart";
import RecentTransactionTable from "../../../components/AdminSummaryTable/RecentTransactionTable";
import TopCenterTable from "../../../components/AdminSummaryTable/TopCenterTable";
import OverViewCard from "../../../components/AdminCardOverview";
import './AdminDashboard.css'
function Dashboard() {

  return (
    <Flex gap={24} style={{ flexDirection: "column", flexWrap: "wrap" }}>
      {/* Card overview */}
      <OverViewCard />
      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={16} lg={16} xl={14}>
          <LineChart />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={10}>
          <PieChart />
        </Col>
      </Row>
      {/* <Row>
        <Col span={24}>
          <BarChart />
        </Col>
      </Row> */}
      {/* Recent Transactions and Top Center Table */}
      <Row gutter={[16, 16]} style={{ alignItems: 'stretch' }}>
        <Col xs={24} lg={12} className="equal-height-col">
          <RecentTransactionTable />
        </Col>
        <Col xs={24} lg={12} className="equal-height-col">
          <TopCenterTable />
        </Col>
      </Row>
    </Flex>
  )
}

export default Dashboard