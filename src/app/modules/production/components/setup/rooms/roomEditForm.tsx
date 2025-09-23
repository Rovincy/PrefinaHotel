import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button, Upload, message, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const RoomEditForm = () => {
  const { register, reset, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const location = useLocation();
  const roomData = location?.state;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomData) {
      setIsActive(roomData.isActive);
      reset({ name: roomData.name });
      if (roomData.image) {
        setFileList([
          {
            uid: '-1',
            name: roomData.image.split('/').pop() || 'room-image',
            status: 'done',
            url: `https://localhost:5001${roomData.image}`,
          },
        ]);
      }
    }
  }, [roomData, reset]);

  const url = `https://localhost:5001/api/Rooms`;

  const onSubmit = async (values: any) => {
    if (fileList.length === 0) {
      message.error('Please upload an image.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', roomData.id.toString());
      formData.append('name', values.name);
      formData.append('isActive', isActive.toString());
      formData.append('typeId', id || '');
      if (fileList[0]?.originFileObj) {
        formData.append('file', fileList[0].originFileObj as File);
      }

      const response = await axios.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      message.success('Room updated successfully');
      reset();
      setFileList([]);
      setIsActive(false);
      navigate(`/rooms/${id}`, { replace: true });
    } catch (error: any) {
      console.error('Error updating room:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      const errorMessage = error.response?.data || 'Failed to update room. Please try again.';
      message.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const onFileSelect: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const file = newFileList[newFileList.length - 1];
    if (file) {
      const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type ?? '');
      const isValidSize = file.size && file.size / 1024 / 1024 < 5; // 5MB limit
      if (!isImage) {
        message.error('Please upload a valid image file (JPEG, PNG, or GIF).');
        setFileList([]);
        return;
      }
      if (!isValidSize) {
        message.error('Image must be smaller than 5MB.');
        setFileList([]);
        return;
      }
      setFileList([file]);
    } else {
      setFileList([]);
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src!;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div
      className="col-12"
      style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <Link to={`/rooms/${id}`}>
        <Button type="default" style={{ marginBottom: '20px' }}>
          Back to list
        </Button>
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row mb-0">
        <div className="col-6 mb-7">
          <label className="required form-label">Image</label>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={onFileSelect}
            onPreview={onPreview}
            beforeUpload={() => false}
            accept="image/jpeg,image/png,image/gif"
          >
            {fileList.length === 0 && (
              <Button 
              // icon={<UploadOutlined />}
              >Upload Image</Button>
            )}
          </Upload>
          {fileList.length === 0 && errors.file && (
            <span style={{ color: 'red' }}>Image is required</span>
          )}
        </div>
          <div className="col-6 mb-7">
            <label htmlFor="name" className="required form-label">Name</label>
            <input
              type="text"
              className="form-control form-control-solid"
              {...register('name', { required: 'Name is required' })}
              defaultValue={roomData?.name.trim()}
            />
            {typeof errors.name?.message === 'string' && (
              <span style={{ color: 'red' }}>{errors.name.message}</span>
            )}
          </div>
          <div className="col-6 mb-7">
            <label htmlFor="isActive" className="form-label">Is Active</label>
            <Checkbox
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            >
              Active
            </Checkbox>
          </div>
        </div>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export { RoomEditForm };