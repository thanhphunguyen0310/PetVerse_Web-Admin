import { Button, Descriptions, Flex, Modal, message } from "antd"
import { deleteVaccine } from "../../configs/api/vaccine";
import FormUpdateVaccine from "./FormUpdateVaccine";
import { useSelector } from "react-redux";
import { useState } from "react";
const ModalVaccineDetails = ({ selectedVaccine, species, setIsModalVisible, fetchVaccineList }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const mapSpeciesName = (speciesIds) => {
    return speciesIds
      .map(({ speciesId }) => {
        const speciesItem = species.find((s) => s.id === speciesId);
        return speciesItem ? speciesItem.name : "Không xác định";
      })
      .join(", ");
  };
  const handleUpdate = () => {
    setIsEditing(true);
  }
  const handleDelete = (vaccineId) => {
    Modal.confirm({
      title: 'Xác nhận xóa vaccine',
      content: 'Bạn có chắc chắn muốn xóa vaccine này?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await deleteVaccine(accessToken, vaccineId);
          message.success('Xóa vaccine thành công!');
          setIsModalVisible(false);
          fetchVaccineList();
        } catch (error) {
          message.error('Failed to disable vaccine!');
        }
      },
    });
  }
  return (
    <>
    {!isEditing ? (
      <>
        <Descriptions
          column={1}
          bordered
          size="large"
          labelStyle={{ fontWeight: "bold", width: "150px", whiteSpace: "nowrap" }}
          contentStyle={{ fontSize: "16px", minWidth: "120px" }}
        >
          <Descriptions.Item label="ID">{selectedVaccine.id}</Descriptions.Item>
          <Descriptions.Item label="Tên vaccine">{selectedVaccine.name}</Descriptions.Item>
          <Descriptions.Item label="Mô tả vaccine">{selectedVaccine.description}</Descriptions.Item>
          <Descriptions.Item label="Độ tuổi tối thiểu (tháng)">{selectedVaccine.minAge}</Descriptions.Item>
          <Descriptions.Item label="Loài">
            {selectedVaccine.species && selectedVaccine.species.length > 0
              ? mapSpeciesName(selectedVaccine.species)
              : "Không có thông tin"}
          </Descriptions.Item>
        </Descriptions>
        <Flex justify="center" align="center" gap={16} style={{ marginTop: "16px" }}>
          <Button className="update-btn" type="primary" onClick={handleUpdate}>
            Chỉnh sửa
          </Button>
          <Button className="delete-btn" type="primary" danger onClick={() => handleDelete(selectedVaccine.id)}>
            Xóa
          </Button>
        </Flex>
      </>
    ) : (
      <FormUpdateVaccine
        initialData={{
          id: selectedVaccine.id,
          name: selectedVaccine.name,
          description: selectedVaccine.description,
          minAge: selectedVaccine.minAge,
          speciesIds: selectedVaccine.species.map(({ speciesId }) => speciesId),
        }}
        setIsModalVisible={setIsModalVisible}
        onCancel={() => setIsEditing(false)} 
        onSuccess={() => {
          setIsEditing(false);
          fetchVaccineList(); 
        }}
      />
    )}
  </>
  )
}

export default ModalVaccineDetails