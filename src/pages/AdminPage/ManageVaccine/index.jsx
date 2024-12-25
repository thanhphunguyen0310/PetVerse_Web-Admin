import {
  Col,
  Flex,
  Row,
  Table,
  Input,
  Pagination,
  Modal,
  Typography,
  Spin
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getVaccineDetails, getVaccineList } from "../../../configs/api/vaccine";
import { getSpecies } from "../../../configs/api/species";
import ModalVaccineDetails from "../../../components/Vaccine/ModalVaccineDetails";
const { Search } = Input;
const { Title } = Typography;

const ManageVaccineRecommendation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vaccine, setVaccine] = useState([]);
  const [species, setSpecies] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const { accessToken } = useSelector((state) => state.auth);

  // Fetch danh sách loài
  const fetchSpecies = async () => {
    try {
      const response = await getSpecies(accessToken);
      setSpecies(response.data.items);
    } catch (error) {
      console.error("Error fetching species:", error);
    }
  };
  const fetchVaccineList = async (page, pageSize) => {
    try {
      setIsLoading(true);
      const response = await getVaccineList(accessToken, page, pageSize, searchTerm);
      setVaccine(response.data.items);
      setTotal(response.data.totalCount);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  const fetchVaccineDetail = async (vaccineId) => {
    try {
      setIsLoading(true);
      const response = await getVaccineDetails(accessToken, vaccineId);
      setSelectedVaccine(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Map speciesId to species name
  const mapSpeciesName = (speciesIds) => {
    return speciesIds
      .map(({ speciesId }) => {
        const speciesItem = species.find((s) => s.id === speciesId);
        return speciesItem ? speciesItem.name : "Không xác định";
      })
      .join(", "); 
  };
  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
      width: 80,
    },
    {
      title: "Tên Vaccine",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 250,
    },
    {
      title: "Loài",
      dataIndex: "species",
      render: (species) => mapSpeciesName(species),
      // filters: species.map((s) => ({ text: s.name, value: s.id })),
      // onFilter: (value, record) => record.speciesId === value, 
      width: 200,
    },
    {
      title: "Độ tuổi tối thiểu (tháng)",
      dataIndex: "minAge",
      width: 150,
    },
  ];
  
  useEffect(() => {
    fetchSpecies();
    fetchVaccineList(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm])

  // Function to handle row click and show modal
  const handleRowClick = (record) => fetchVaccineDetail(record.id);
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
    setSelectedVaccine(null);
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
            dataSource={vaccine}
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
            Thông tin chi tiết vaccine
          </Title>
        }
        width={700}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        centered
      >
        {selectedVaccine ? (
          <ModalVaccineDetails 
            selectedVaccine={selectedVaccine} 
            species={species} 
            setIsModalVisible={setIsModalVisible}
            fetchVaccineList={fetchVaccineList}/>
        ) : (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        )}
      </Modal>
    </>
  )
}

export default ManageVaccineRecommendation