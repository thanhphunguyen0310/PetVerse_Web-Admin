import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getReportList, getReportDetails } from '../../../configs/api/report';
import { Col, Flex, Input, Modal, Pagination, Row, Spin, Table, Tag, Typography } from 'antd';
import ModalReportDetails from '../../../components/Reports/ModalReportDetails';
import { useSearchParams } from 'react-router-dom';

const { Search } = Input;
const { Title } = Typography;

// Function to render status as a tag with color
const renderStatusTag = (status) => {
  let color = "";
  let text = "";

  switch (status) {
    case 0:
      color = "orange";
      text = "Đang xử lí";
      break;
    case 1:
      color = "blue";
      text = "Chấp nhận";
      break;
    case 2:
      color = "red";
      text = "Từ chối";
      break;
    default:
      color = "gray";
      text = "Không rõ";
  }

  return <Tag color={color}>{text}</Tag>;
};

const columns = [
  {
    title: "STT",
    key: "index",
    render: (text, record, index) => index + 1, // Auto-generate index starting from 1
    width: 50,
  },
  {
    title: "Tiêu đề",
    dataIndex: "title",
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Lý do",
    dataIndex: "reason",
  },
  {
    title: "Ngày tạo báo cáo",
    dataIndex: "createdDate",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status) => renderStatusTag(status),
    filters: [
      { text: 'Đang xử lí', value: 0 },
      { text: 'Chấp nhận', value: 1 },
      { text: 'Từ chối', value: 2 },
    ],
    onFilter: (value, record) => record.status === value,
  }
];
const UserReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportDatas, setReportDatas] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReport, setSelectReport] = useState(null);
  const { accessToken } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();

  const fetchReportList = async (page, pageSize, search) => {
    try {
      setIsLoading(true);
      const response = await getReportList(accessToken, page, pageSize, search);
      // console.log(response.data.items);
      // Filter the reports with status 0
      const filteredReports = response.data.items.filter(report => report.status === 0);
      // console.log(filteredReports);
      setReportDatas(filteredReports);
      setTotal(response.data.totalCount);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  const fetchReportDetails = async (reportId) => {
    try {
      setIsLoading(true);
      const response = await getReportDetails(accessToken, reportId);
      setSelectReport(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchReportList(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm])
  useEffect(() => {
    // Chỉ kiểm tra reportId một lần khi component được mount
    const reportId = searchParams.get("reportId");
    if (reportId) {
      fetchReportDetails(reportId);
    }
  }, []);
  // Function to handle row click and show modal
  const handleRowClick = async (record) => {
    fetchReportDetails(record.id);
  };
  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchReportList(1, pageSize, value);
  };
  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchReportList(page, pageSize, searchTerm);
  };
  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectReport(null);
  };
  return (
    <>
      <Flex style={{ flexDirection: "column" }} gap={16}>
        {/* Search Bar */}
        <Row>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm theo tên"
              onSearch={handleSearch}
              allowClear
              enterButton
            />
          </Col>
        </Row>
        {/* Table display data */}
        {isLoading ? (
          <Spin size='large' />
        ) : (
          <Table
            columns={columns}
            dataSource={reportDatas}
            pagination={false}
            showSorterTooltip={{
              target: "sorter-icon",
            }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        )}
        {/* Custom Pagination */}
        <Flex justify="flex-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginationChange}
          />
        </Flex>
      </Flex>
      <Modal
        title={
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            Thông tin chi tiết
          </Title>
        }
        width={700}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={false}
        centered
      >

        <ModalReportDetails report={selectedReport} setIsModalVisible={setIsModalVisible} fetchReportList={fetchReportList} />

      </Modal>
    </>
  )
}

export default UserReport