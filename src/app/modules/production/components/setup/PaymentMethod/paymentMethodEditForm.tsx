import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { Api_Endpoint } from '../../../../../services/ApiCalls';

const PaymentMethodEditForm = () => {
  const { register, reset, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve the passed payment method data from location state
  const paymentMethodData = location?.state;

  // Set the initial checkbox state based on paymentMethodData when component mounts
  useEffect(() => {
    if (paymentMethodData) {
      setIsActive(paymentMethodData.isActive);
      reset({
        name: paymentMethodData.name,
        description: paymentMethodData.description,
      });
    }
  }, [paymentMethodData, reset]);

  const url = `${Api_Endpoint}/paymentMethod`;

  const OnSubmit = handleSubmit(async (values, event) => {
    event?.preventDefault();
    setLoading(true);
    setSubmitLoading(true);

    const data = {
      id: paymentMethodData.id,
      name: values.name,
      isActive: isActive,  // Use the isActive state for submission
      description: values.description,
    };

    try {
      const response = await axios.put(url, data);
      setLoading(false);
      reset();
      navigate(`/paymentMethod`, { replace: true });
      if (response.status === 200) {
        message.success("Payment method updated successfully");
      }
      return response.statusText;
    } catch (error:any) {
      setLoading(false);
      message.error("Failed to update payment method");
      return error.statusText;
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
      <Link to="/paymentMethod">
        <Button type="link" className='mb-7'>
          Back to list
        </Button>
      </Link>

      <form onSubmit={OnSubmit}>
        <div className="tab-content">
          <div className='col-8'>
            <div className='row mb-0'>
              <div className='col-6 mb-7'>
                <label htmlFor="name" className="required form-label">Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="form-control form-control-solid"
                />
              </div>
              <div className='col-6 mb-7'>
                <label htmlFor="description" className="required form-label">Description</label>
                <input
                  type="text"
                  {...register("description")}
                  className="form-control form-control-solid"
                />
              </div>
              <div className='col-6 mb-7'>
                <label htmlFor="isActive" className="required form-label">isActive</label>
                <Checkbox
                  checked={isActive}
                  className="form-control form-control-solid"
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>
        <Button onClick={OnSubmit} type="primary" loading={loading}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export { PaymentMethodEditForm };
