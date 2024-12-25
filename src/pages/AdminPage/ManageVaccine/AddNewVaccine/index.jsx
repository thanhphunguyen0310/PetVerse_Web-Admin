import { useEffect, useState } from "react";
import { Form, Input, Select, Button, Typography, message, InputNumber, Col, Row, Card } from "antd";
import { createVaccine } from "../../../../configs/api/vaccine";
import { getSpecies } from "../../../../configs/api/species";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const AddNewVaccine = () => {
  const [speciesList, setSpeciesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { accessToken } = useSelector((state) => state.auth)

  // Fetch species list
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        setLoading(true);
        const response = await getSpecies(accessToken);
        setSpeciesList(response.data.items || []);
      } catch (error) {
        message.error("Failed to fetch species data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSpecies();
  }, [accessToken]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const vaccine = {
        speciesIds: Array.isArray(values.speciesId) ? values.speciesId : [values.speciesId],
        name: values.name,
        description: values.description,
        minAge: values.minAge,
      };
      await createVaccine(accessToken, vaccine);
      message.success("Tạo mới vaccine thành công!");
      form.resetFields();
    } catch (error) {
      message.error("Tạo vaccine thất bại.");
    }
  };

  return (
      <div style={{ maxWidth: "700px", margin: "auto" }}>
        <Card
          style={{
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Title level={2} style={{ textAlign: "center", color: "#333" }}>
            Tạo mới vaccine
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ gap: "20px" }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Tên vaccine"
                  name="name"
                  rules={[
                    { required: true, message: "Hãy nhập tên vaccine!" },
                    { max: 50, message: "Tên vaccine không được quá 50 ký tự!" },
                  ]}
                >
                  <Input placeholder="Nhập tên vaccine" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[
                    { required: true, message: "Hãy nhập mô tả!" },
                    {
                      validator: (_, value) => {
                        const wordCount = value ? value.trim().split(/\s+/).length : 0;
                        if (wordCount > 200) {
                          return Promise.reject("Mô tả không được quá 500 từ!");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder="Nhập mô tả" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Độ tuổi sử dụng tối thiểu(tháng)"
                  name="minAge"
                  rules={[
                    { required: true, message: "Hãy nhập độ tuổi sử dụng tối thiểu!" },
                    {
                      type: "number",
                      min: 0,
                      message: "Tuổi phải lớn hơn hoặc bằng 0!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Nhập tuổi tối thiểu sử dụng"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Loài"
                  name="speciesId"
                  rules={[
                    { required: true, message: "Hãy chọn loài!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn loài"
                    loading={loading}
                    mode="multiple"
                    allowClear
                  >
                    {speciesList.map((species) => (
                      <Option key={species.id} value={species.id}>
                        {species.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#1890FF",
                  borderColor: "#1890FF",
                  fontWeight: "bold",
                }}
              >
                Tạo mới vaccine
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
  );
};

export default AddNewVaccine;
