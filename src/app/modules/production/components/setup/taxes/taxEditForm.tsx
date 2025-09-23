import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Api_Endpoint } from '../../../../../services/ApiCalls';

const TaxEditForm = () => {
  const { register, reset, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [isLevy, setIsLevy] = useState(false); // Initialize isLevy state
  const location = useLocation();
  const taxData = location?.state;
  const navigate = useNavigate();

  useEffect(() => {
    if (taxData) {
      setIsLevy(taxData.isLevy); // Set initial isLevy state from taxData
      reset({
        name: taxData.name,
        rate: taxData.rate,
      });
    }
  }, [taxData, reset]);

  const url = `${Api_Endpoint}/tax`;

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);

    const data = {
      id: taxData.id,
      name: values.name,
      isLevy: isLevy, // Use the current isLevy state
      rate: values.rate,
    };

    try {
      const response = await axios.put(url, data);
      setLoading(false);
      reset();
      navigate(`/tax/`, { replace: true });
      if (response.status === 200) {
        message.success("Tax updated successfully");
      }
      return response.statusText;
    } catch (error:any) {
      setLoading(false);
      message.error("Failed to update tax");
      return error.message;
    }
  });

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
      <Link to="/tax/">
        <span style={{ fontSize: "16px", fontWeight: "500" }} className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'>
          Back to list
        </span>
      </Link>
      <form onSubmit={onSubmit}>
        <div className="tab-content">
          <div className='col-8'>
            <div className='row mb-0'>
              <div className='col-6 mb-7'>
                <label htmlFor="name" className="required form-label">Name</label>
                <input type="text" {...register("name")} className="form-control form-control-solid" />
              </div>
              <div className='col-6 mb-7'>
                <label htmlFor="rate" className="required form-label">Rate</label>
                <input type="number" {...register("rate")}  
                step="0.01" // Allows two decimal places 
                className="form-control form-control-solid" />
              </div>
              <div className='col-6 mb-7'>
                <label htmlFor="isLevy" className="required form-label">isLevy</label>
                <Checkbox
                  checked={isLevy} // Use isLevy state here
                  onChange={(e) => setIsLevy(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>
        <Button htmlType="submit" type="primary" loading={loading}>Submit</Button>
      </form>
    </div>
  );
}

export { TaxEditForm };
