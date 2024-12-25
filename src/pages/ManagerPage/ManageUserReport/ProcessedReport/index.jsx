import { useEffect, useState } from 'react'
import { getReportDetails, getReportList } from '../../../../configs/api/report';
import { useSelector } from 'react-redux';
import { Col, Flex, Input, Modal, Pagination, Row, Spin, Table, Tag, Tooltip, Typography } from 'antd';
import ModalReportDetails from '../../../../components/Reports/ModalReportDetails';
import dayjs from 'dayjs';

const { Search } = Input;
const { Title } = Typography;
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
      render: (createdDate) => {
        const formattedDate = dayjs(createdDate, "DD/MM/YYYY HH:mm");
        return formattedDate.isValid() ? (
          <Tooltip title={formattedDate.format("HH:mm DD/MM/YYYY")}>
            {formattedDate.format("HH:mm DD/MM/YYYY")}
          </Tooltip>
        ) : (
          "Invalid Date"
        );
      },
      align: "center",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => renderStatusTag(status),
      filters: [
        { text: 'Chấp nhận', value: 1 },
        { text: 'Từ chối', value: 2 },
      ],
      onFilter: (value, record) => record.status === value,
    }
  ];
const ProcessedReport = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [pageSize, setPageSize] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [reportDatas, setReportDatas] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReport, setSelectReport] = useState(null);
    const { accessToken } = useSelector((state) => state.auth);
  
    const fetchReportList = async () => {
      try {
        setIsLoading(true);
        const response = await getReportList(accessToken, currentPage, pageSize, searchTerm);
        // Filter the reports with status 0
        const filteredReports = response.data.items.filter(report => report.status === 1 || report.status === 2);
        setReportDatas(filteredReports);
        setTotal(response.data.totalCount);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  
    useEffect(() => {
      fetchReportList(accessToken, currentPage, pageSize);
    }, [currentPage, pageSize, searchTerm])
    // Function to handle row click and show modal
    const handleRowClick = async (record) => {
      setIsLoading(true);
      try {
        const reportDetail = await getReportDetails(accessToken, record.id);
        setSelectReport(reportDetail.data);
        setIsModalVisible(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
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

export default ProcessedReport