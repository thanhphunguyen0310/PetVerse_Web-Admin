import { Col, Flex, Row } from 'antd'
import ManagerCardOverview from '../../../components/ManagerCardOverview'
import ManagerLineChart from '../../../components/Charts/ManagerCharts/LineChart'
import ManagerBarChart from '../../../components/Charts/ManagerCharts/BarChart'

function ManagerDashboard() {
  return (
    <Flex gap={24} style={{ flexDirection: "column", flexWrap: "wrap" }}>
    {/* Card overview */}
    <ManagerCardOverview />
    {/* Charts */}
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <ManagerLineChart />
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <ManagerBarChart />
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
        {/* <RecentTransactionTable /> */}
      </Col>
      <Col xs={24} lg={12} className="equal-height-col">
        {/* <TopCenterTable /> */}
      </Col>
    </Row>
  </Flex>
  )
}

export default ManagerDashboard