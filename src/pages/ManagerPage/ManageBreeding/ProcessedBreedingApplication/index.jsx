import { Col, Flex, Row, Input, Pagination, Table, Spin, Modal, Typography, Tag } from 'antd'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getBreeding, getPetBreedingDetails } from '../../../../configs/api/breeding';
import ModalDetailBreeding from '../../../../components/Breeding/ModalDetailBreeding';
const { Search } = Input;
const { Title } = Typography;

// Function to format price in VND
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Function to render status as a tag with color
const renderStatusTag = (status) => {
  let color = "";
  let text = "";

  switch (status) {
    case 1:
      color = "orange";
      text = "Đang xử lí";
      break;
    case 2:
      color = "blue";
      text = "Chấp nhận";
      break;
    case -1:
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
    title: "Tên thú",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Loài",
    dataIndex: "speciesId",
    render: (speciesId) => {
      switch (speciesId) {
        case 1:
          return "Chó";
        case 2:
          return "Mèo";
        case 3:
          return "Khác";
        default:
          return "Không xác định";
      }
    },
  },
  {
    title: "Giá tiền",
    dataIndex: "price",
    render: (price) => formatPrice(price), // Format price in VND
    sorter: (a, b) => a.price - b.price,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    width: 400
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status) => renderStatusTag(status), // Render status as a tag with color
    filters: [
      { text: 'Chấp nhận', value: 2 },
      { text: 'Từ chối', value: -1 },
    ],
    onFilter: (value, record) => record.status === value,
    filterMultiple: false,
  },
];

const ProcessedBreedingApplication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(2); // Default to "Chấp nhận"
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [breeding, setBreedings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBreeding, setSelectedBreeding] = useState(null);
  const { accessToken } = useSelector((state) => state.auth);

  // Fetch breeding list based on page, pageSize, search term, and status
  const fetchBreedingList = async (page, pageSize, search, status) => {
    try {
      setIsLoading(true);
      const response = await getBreeding(accessToken, status, page, pageSize, search);
      setBreedings(response.data.items);
      setTotal(response.data.totalCount);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBreedingList(currentPage, pageSize, searchTerm, selectedStatus);
  }, [currentPage, pageSize, searchTerm, selectedStatus]);

  // Function to handle row click and show modal
  const handleRowClick = async (record) => {
    setIsLoading(true);
    try {
      const breedingDetail = await getPetBreedingDetails(accessToken, record.id);
      setSelectedBreeding(breedingDetail.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status filter change
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrentPage(1); // Reset to first page when filter status changes
    fetchBreedingList(1, pageSize, searchTerm, value);
  };

  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
    fetchBreedingList(1, pageSize, value, selectedStatus);
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchBreedingList(page, pageSize, searchTerm, selectedStatus);
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedBreeding(null);
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
            dataSource={breeding}
            pagination={false}
            showSorterTooltip={{
              target: "sorter-icon",
            }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            onChange={(pagination, filters) => {
              if (filters.status) {
                handleStatusChange(filters.status[0]);
              }
            }}
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

      {/* Modal for detailed breeding information */}
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
        <ModalDetailBreeding breeding={selectedBreeding} setIsModalVisible={setIsModalVisible} />
      </Modal>
    </>
  );
};

export default ProcessedBreedingApplication;
