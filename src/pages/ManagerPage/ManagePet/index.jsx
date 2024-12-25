import { Col, Flex, Row, Input, Image, Table, Pagination, Spin, Modal } from 'antd'
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { IoFemale, IoMale } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPets, getPetDetails } from '../../../configs/api/pet';
import ModalDetailPet from '../../../components/Pet/ModalDetailPet';
import FormUpdatePet from '../../../components/Pet/FormUpdatePet';
const { Search } = Input;
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
    render: (avatar) => (
      <Flex justify="center">
        <Image
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "1px solid #b8b0b0",
            objectFit: "cover",
          }}
          preview={false}
          src={avatar}
          alt="avatar"
        />
      </Flex>
    ),
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
          return "Không xác định"; // Default case if speciesId doesn't match known values
      }
    },
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    width: 120,
    render: (gender) => (
      <Flex justify="center" align="middle" style={{ height: '100%' }}>
        {gender === 1 ? (
          <IoMale style={{ color: "#0314fc", fontSize: "18px" }} />
        ) : (
          <IoFemale style={{ color: "#fc03d3", fontSize: "18px" }} />
        )}
      </Flex>
    ),
  },
  {
    title: (<Flex justify="center">Cân nặng (kg)</Flex>),
    dataIndex: "weight",
    width: 150,
    render: (weight) => (
      <Flex justify="center">
        {weight}
      </Flex>
    )
  },
  {
    title: (<Flex justify="center">Đã triệt sản</Flex>),
    dataIndex: "sterilized",
    render: (sterilized) =>
      <Flex justify="center">
        {sterilized ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        )}
      </Flex>
  }
];
const ManagePet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pets, setPets] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const { accessToken } = useSelector((state) => state.auth);
  // get all pet
  const fetchPet = async (page, pageSize, search) => {
    try {
      setIsLoading(true)
      const response = await getPets(accessToken, page, pageSize, search);
      setPets(response.data.items);
      setTotal(response.data.totalCount);
      setIsLoading(false)
    } catch (error) {
      console.error(error);
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchPet(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);
  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
    fetchPet(1, pageSize, value);
  };
  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchPet(page, pageSize, searchTerm);
  };
  // Function to handle row click and show modal
  const handleRowClick = async (record) => {
    setIsLoading(true);
    try {
      const petDetail = await getPetDetails(accessToken, record.id);
      setSelectedPet(petDetail.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setSelectedPet(null);
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
            dataSource={pets}
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
        width={700}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={false}
        centered
      >
        {isEditing ? (
          <FormUpdatePet
            pet={selectedPet}
            setIsEditing={setIsEditing}
            onClose={handleModalClose}
            setIsModalVisible={setIsModalVisible}
            fetchPet={() => fetchPet(currentPage, pageSize, searchTerm)}
          />
        ) : (
          <ModalDetailPet pet={selectedPet} setIsEditing={setIsEditing} setIsModalVisible={setIsModalVisible} fetchPet={() => fetchPet(currentPage, pageSize, searchTerm)} />
        )}
      </Modal>
    </>
  )
}

export default ManagePet

// footer={
//   <Flex justify="center" gap={12}>
//     {isEditing ? (
//       <>
//         <Button type="primary"
//           onClick={() => form.submit()}
//         >
//           Lưu thay đổi
//         </Button>
//         <Button key="cancel"
//           onClick={() => setIsEditing(false)}
//         >
//           Hủy
//         </Button>
//       </>
//     ) : (
//       <>
//         <Button
//           key="edit"
//           type="primary"
//           onClick={handleEditClick}
//         >
//           Chỉnh sửa
//         </Button>
//         <Button
//           key="delete"
//           type="primary"
//           danger
//         // onClick={() => deletePetCenter(selectedPetsitter.id)}
//         >
//           Xóa
//         </Button>
//       </>
//     )}
//   </Flex>
// }