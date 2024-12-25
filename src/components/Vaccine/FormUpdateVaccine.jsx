import { Button, Flex, Form, Input, Select, message } from "antd";
import { updateVaccine } from "../../configs/api/vaccine"; // Hàm API để cập nhật vaccine
import { useSelector } from "react-redux";

const FormUpdateVaccine = ({ initialData, onCancel, onSuccess, setIsModalVisible }) => {
    const { accessToken } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await updateVaccine(accessToken, initialData.id, { ...initialData, ...values });
      message.success("Cập nhật vaccine thành công!");
      onSuccess();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Cập nhật vaccine thất bại!");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        name: initialData.name,
        description: initialData.description,
        minAge: initialData.minAge,
        speciesIds: initialData.speciesIds,
      }}
      onFinish={handleSubmit}
    >
      <Form.Item name="name" label="Tên vaccine" rules={[{ required: true, message: "Vui lòng nhập tên vaccine" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Mô tả vaccine"
        rules={[{ required: true, message: "Vui lòng nhập mô tả vaccine" }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="minAge"
        label="Độ tuổi tối thiểu (tháng)"
        rules={[{ required: true, message: "Vui lòng nhập độ tuổi tối thiểu" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="speciesIds"
        label="Loài"
        rules={[{ required: true, message: "Vui lòng chọn ít nhất một loài" }]}
      >
        <Select allowClear mode="multiple" placeholder="Chọn loài">
          {/* Tùy chỉnh danh sách loài */}
          <Select.Option value={1}>Chó</Select.Option>
          <Select.Option value={2}>Mèo</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Flex justify="center" align="center" gap={16}>
        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
        <Button onClick={onCancel}>
          Hủy
        </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default FormUpdateVaccine;
