import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getPlaceList, getPlaceDetails } from "../../../configs/api/place"
import { Col, Flex, Image, Input, Modal, Pagination, Row, Spin, Table, Typography } from "antd";
import ModalPlaceDetails from "../../../components/Place/ModalPlaceDetails";

const { Search } = Input;
const { Title } = Typography;
const ManagePlaceRecommendation = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [place, setPlace] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const fetchPlaceList = async (page, pageSize) => {
    try {
      setIsLoading(true);
      const response = await getPlaceList(accessToken, page, pageSize, searchTerm);
      setPlace(response.data.items);
      setTotal(response.data.totalCount);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  const fetchPlaceDetail = async (placeId) => {
    try {
      setIsLoading(true);
      const response = await getPlaceDetails(accessToken, placeId);
      setSelectedPlace(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
      width: 80,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (url) => (
        <Image
          src={url}
          alt="place"
          width={80}
          height={60}
          preview={false}
          style={{ borderRadius: "4px", objectFit: "cover", border: "1px solid #ccc" }}
        />
      ),
    },
    {
      title: "Tên địa điểm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Loại hình",
      dataIndex: "type",
      key: "type",
      render: (type) =>
        type === 1
          ? "Công viên"
          : type === 2
            ? "Hồ bơi"
            : type === 3
              ? "Café"
              : "Khác",
    },
  ];


  useEffect(() => {
    fetchPlaceList(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm])

  // Function to handle row click and show modal
  const handleRowClick = (record) => fetchPlaceDetail(record.id);
  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    // fetchVaccineList(page, pageSize, searchTerm);
  };
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
    // fetchVaccineList(currentPage, pageSize, value);
  };
  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPlace(null);
  };
  return (
    <>
      <Flex style={{ flexDirection: "column" }} gap={16}>
        {/* search bar */}
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
            dataSource={place}
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
            showSizeChanger={false}
            onChange={handlePaginationChange}
          />
        </Flex>
      </Flex>
      <Modal
        title={
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            Thông tin chi tiết địa điểm
          </Title>
        }
        width={700}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        centered
      >
        {selectedPlace ? (
          <ModalPlaceDetails
            selectedPlace={selectedPlace}
            setIsModalVisible={setIsModalVisible}
            fetchPlaceList={fetchPlaceList} />
        ) : (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        )}
      </Modal>
    </>
  );
};

export default ManagePlaceRecommendation;
