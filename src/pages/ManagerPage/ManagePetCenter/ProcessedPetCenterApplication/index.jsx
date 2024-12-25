import { Col, Flex, Image, Input, Modal, Pagination, Row, Spin, Table, Tag, Typography } from 'antd'
import {
  getApplication,
  getApplicationDetail,
} from "../../../../configs/api/application";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import ModalApplicationDetail from '../../../../components/Applications/ModalApplicationDetail';

const { Search } = Input;
const { Title } = Typography;
const ProcessedPetCenterApplication = () => {
  const { accessToken } = useSelector((state) => state?.auth)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [application, setApplication] = useState([]);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => index + 1, // Auto-generate index starting from 1
      width: 50,
    },
    {
      title: "Hình ảnh",
      dataIndex: "avatar",
      render: (image) => (
        <Flex justify="center">
          <Image
            style={{
              border: "1px solid #b8b0b0",
              borderRadius: "50%", // Makes the image circular
              objectFit: "cover", // Ensures the image covers the area without distortion
            }}
            preview={false}
            width={64}
            height={64}
            src={image}
          />
        </Flex>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 200
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Dịch vụ",
      dataIndex: "applicationPetServices",
      render: (services) => (
        <span >
          {services.map((service, index) => {
            let serviceName = "";
            let color = "";
            // Map the petServiceId to a specific service name and color
            switch (service.petServiceId) {
              case 1:
                serviceName = "Trông thú";
                color = "green";
                break;
              case 2:
                serviceName = "Huấn luyện";
                color = "blue";
                break;
              case 3:
                serviceName = "Dịch vụ spa";
                color = "purple";
                break;
              case 4:
                serviceName = "Bác sĩ thú y";
                color = "red";
                break;
              default:
                serviceName = "Dịch vụ khác";
                color = "gray";
            }

            return (
              <Tag color={color} key={index}>
                {serviceName}
              </Tag>
            );
          })}
        </span>
      ),
      width: 220,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        { text: "Chấp nhận", value: 2 },
        { text: "Từ chối", value: -1 },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let statusText = "";
        let color = "";

        // Map the status to a specific label and color
        switch (status) {
          case 1:
            statusText = "Đang xử lí";
            color = "orange";
            break;
          case 2:
            statusText = "Chấp nhận";
            color = "blue";
            break;
          case -1:
            statusText = "Từ chối";
            color = "red";
            break;
          default:
            statusText = "Không rõ";
            color = "gray";
        }

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
  ];
  const fetchApplication = async (page, pageSize, search) => {
    try {
      const response = await getApplication(accessToken, page, pageSize, search);
      setApplication(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchApplicationDetail = async (applicationId) => {
    try {
      const response = await getApplicationDetail(accessToken, applicationId);
      setSelectedApplication(response.data);

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchApplication(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);
  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchApplication(1, pageSize, value);
  };
  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchApplication(page, pageSize, searchTerm);
  };
  // Function to handle row click and show modal
  const handleRowClick = async (record) => {
    try {
      await fetchApplicationDetail(record.id);
      setIsModalVisible(true);
    } catch (error) {
      console.error(error);
    }
  };
  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedApplication(null);
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
        <Table
          columns={columns}
          dataSource={application}
          pagination={false}
          showSorterTooltip={{
            target: "sorter-icon",
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
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
        centered>
        {selectedApplication ? (
          <ModalApplicationDetail
            selectedApplication={selectedApplication}
          />
        ) : (
          <Flex justify="center" align="center" style={{ height: "200px" }}>
            <Spin size="large" />
          </Flex>
        )}
      </Modal>
    </>
  )
}

export default ProcessedPetCenterApplication

{/* {selectedApplication &&
        <Modal
          title={
            <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
              Chi tiết đơn đăng ký
            </Title>
          }
          width={700}
          open={isModalVisible}
          onCancel={setIsModalVisible(false)}
          footer={false}
        >
          <ModalApplicationDetail selectedApplication={selectedApplication} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </Modal>
      } */}