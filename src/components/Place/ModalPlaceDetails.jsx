import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button, Descriptions, Flex, Image, Modal, Tag, message } from "antd"
import FormUpdatePlace from './FormUpdatePlace';
import { deletePlace } from '../../configs/api/place';
import { getSpecies } from "../../configs/api/species";
const ModalPlaceDetails = ({ selectedPlace, setIsModalVisible, fetchPlaceList }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const [species, setSpecies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchSpecies = async () => {
    try {
      const response = await getSpecies(accessToken);
      setSpecies(response.data.items);
    } catch (error) {
      console.error("Error fetching species:", error);
    }
  };
  useEffect(() => {
    fetchSpecies();
  }, [selectedPlace])
  const mapSpeciesName = (speciesList) => {
  
    return speciesList
      .map((speciesItem) => {
        const match = species.find((s) => s.id === speciesItem.id);
        return match ? match.name : "Không xác định";
      })
      .join(", ");
  };

  const handleDelete = (placeId) => {
    Modal.confirm({
      title: 'Xác nhận xóa địa điểm',
      content: 'Bạn có chắc chắn muốn xóa địa điểm này?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await deletePlace(accessToken, placeId);
          message.success('Xóa địa điểm thành công!');
          setIsModalVisible(false);
          fetchPlaceList();
        } catch (error) {
          message.error('Xóa địa điểm thất bại!');
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
            <Descriptions.Item label="ID">{selectedPlace.id}</Descriptions.Item>
            <Descriptions.Item label="Hình ảnh">
              <Image
                src={selectedPlace.image}
                alt="place"
                width={120}
                height={120}
                preview={{
                  mask: <span style={{
                    color: "#fff",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    padding: "4px 8px",
                    borderRadius: "4px"
                  }}>Xem ảnh</span>
                }}
                style={{ borderRadius: "4px", objectFit: "cover", border: "1px solid #ccc" }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Địa điểm">
              {selectedPlace.name}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {selectedPlace.address}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {selectedPlace.description}
            </Descriptions.Item>
            <Descriptions.Item label="Dịch vụ">
              {selectedPlace.isFree ? (
                <Tag color="green">Miễn Phí</Tag>
              ) : (
                <Tag color="red">Có Phí</Tag>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Loài">
              {selectedPlace.species && selectedPlace.species.length > 0
                ? mapSpeciesName(selectedPlace.species)
                : "Không có thông tin"}
            </Descriptions.Item>
          </Descriptions>
          <Flex justify="center" align="center" gap={16} style={{ marginTop: "16px" }}>
            {/* <Button className="update-btn" type="primary" onClick={handleUpdate}>
              Chỉnh sửa
            </Button> */}
            <Button className="delete-btn" type="primary" danger onClick={() => handleDelete(selectedPlace.id)}>
              Xóa
            </Button>
          </Flex>
        </>
      ) : (
        <FormUpdatePlace
          initialData={{
            id: selectedPlace.id,
            name: selectedPlace.name,
            description: selectedPlace.description,
            minAge: selectedPlace.minAge,
          }}
          setIsModalVisible={setIsModalVisible}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false);
            fetchPlaceList;
          }}
        />
      )}
    </>
  )
}

export default ModalPlaceDetails