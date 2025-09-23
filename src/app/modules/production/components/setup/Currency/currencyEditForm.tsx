import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message, Checkbox } from 'antd';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Api_Endpoint } from '../../../../../services/ApiCalls';

const CurrencyEditForm = () => {
  const [formData, setFormData] = useState({});
  const { register, reset, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const location = useLocation();
  const currencyData = location?.state;
  const navigate = useNavigate();
  const [isBase, setIsBase] = useState(currencyData?.isBase || false);

  const url = `${Api_Endpoint}/currency`;

  const OnSubmit = handleSubmit(async (values, event) => {
    event?.preventDefault();
    setLoading(true);
    setSubmitLoading(true);

    const data = {
      id: currencyData.id,
      name: values.name,
      isBase: isBase, // Explicitly set from state
      rate: values.rate,
      symbol: values.symbol,
    };

    try {
      const response = await axios.put(url, data);
      setLoading(false);
      reset();
      navigate(`/currency/`, { replace: true });

      if (response.status === 200) {
        message.success("Currency updated successfully");
      }
      return response.statusText;
    } catch (error:any) {
      setLoading(false);
      message.error("Failed to update currency");
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
      <Link to="/currency/">
        <span
          style={{ fontSize: "16px", fontWeight: "500" }}
          className="mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary"
        >
          Back to list
        </span>
      </Link>
      <form onSubmit={OnSubmit}>
        <div className="tab-content">
          <div className="col-8">
            <div className="row mb-0">
              <div className="col-6 mb-7">
                <label htmlFor="name" className="required form-label">Name</label>
                <input
                  type="text"
                  {...register("name")}
                  defaultValue={currencyData.name}
                  className="form-control form-control-solid"
                />
              </div>
              <div className="col-6 mb-7">
                <label htmlFor="rate" className="required form-label">Rate</label>
                <input
                  type="number"
                  {...register("rate")}
                  defaultValue={currencyData.rate}
                  className="form-control form-control-solid"
                />
              </div>
              <div className="col-6 mb-7">
                <label htmlFor="symbol" className="required form-label">Symbol</label>
                <input
                  type="text"
                  {...register("symbol")}
                  defaultValue={currencyData.symbol}
                  className="form-control form-control-solid"
                  readOnly // Prevents edits but keeps the value in the form submission
                />
              </div>

              {/* <div className="col-6 mb-7">
                <label htmlFor="isBase" className="required form-label">Base Currency</label>
                <Checkbox
                  {...register("isBase")}
                  checked={isBase}
                  onChange={(e) => setIsBase(e.target.checked)}
                />
              </div> */}
            </div>
          </div>
        </div>
        <Button onClick={OnSubmit} type="primary" loading={loading}>Submit</Button>
      </form>
    </div>
  );
};

export { CurrencyEditForm };
