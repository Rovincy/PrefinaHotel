import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import { useForm } from 'react-hook-form';
import axios from 'axios';
// import { Api_Endpoint, FetchBranches, fetchRolesApi } from '../../../services/ApiCalls';
import { useAuth } from '../../../../auth';
import { Api_Endpoint, fetchRolesApi } from '../../../../../services/ApiCalls';
// import { useAuth } from '../../../../modules/auth';

interface UserFormData {
  source: string;
  firstName?: string;
  lastname?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: string;
  companyId?: string;
  branchId?: number;
}

const UserEditForm = () => {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('tab1');
  const { register, reset, handleSubmit } = useForm<UserFormData>({
    defaultValues: {
      source: 'RX', // Set default value for source
    },
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { data: userRoles, isLoading: userRolesLoad } = useQuery('roles', fetchRolesApi);
  const { mutate: updateUserDetails } = useMutation((values) => axios.put(`${Api_Endpoint}/users`, values), {
    onSuccess: () => {
      message.success("User updated successfully");
      setLoading(false);
      // navigate('/user-management/users');
      navigate('/users')
    },
    onError: (error: any) => {
      setLoading(false);
      console.log(error);
      message.error("Update failed");
    },
  });
  const location = useLocation();
  let userData: any = location?.state;

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  const navigate = useNavigate();

  const handleTabChange = (newTab: any) => {
    setActiveTab(newTab);
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps['onChange'] = (info) => {
    let fileList = [...info.fileList];

    // Limit the file list to only one file
    fileList = fileList.slice(-1);

    // Update the state with the new file list
    setFileList(fileList);
  };

  const onPreview = async (file: any) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;

    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const OnSubmit = handleSubmit(async (values, event) => {
    event?.preventDefault();
    setLoading(true);

    try {
      // const role = userRoles?.data.find((e: { id: any }) => e.id === values.role);
      const userDetails: any = {
        id: userData.id,
        firstName: values.firstName,
        lastName: values.lastname,
        email: values.email,
        roleId: values.role,
        username: values.username,
        // password: values.password==='undefined' ? currentUser?.password : values.password,
        password: values.password === '' ? null : values.password,
        // source: values.source,
      };
      // console.log(userDetails);
      // setLoading(false);
      updateUserDetails(userDetails);
    } catch (error: any) {
      setLoading(false);
      return error.statusText;
    }
  });

  return (
    <div
      className='col-12'
      style={{
        padding: '40px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <Link to='/users'>
        <a
          style={{ fontSize: '16px', fontWeight: '500' }}
          className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
        >
          Back to list
        </a>
      </Link>

      <div className='tabs'></div>
      <form onSubmit={OnSubmit}>
        <div className='tab-content'>
          {/* {activeTab === 'tab1' && ( */}
          <div className='col-12'>
            <div className='row mb-0'>
              {/* <div className='col-6 mb-7'>
                <label htmlFor="exampleFormControlInput2" className="required form-label">Source</label>
                <select {...register("source")} className="form-select form-select-solid" aria-label="Select Company Type"
                  defaultValue={userData?.source || 'RX'} // Set default value from userData or 'RX'
                >
                  <option value="RX">RX</option>
                  <option value="RX-TPA">RX-TPA</option>
                </select>
              </div> */}
              <div className='col-4 mb-7'>
                <label htmlFor='firstName' className='required form-label'>
                  First Name
                </label>
                <input
                  type='text'
                  defaultValue={userData.firstName}
                  {...register('firstName')}
                  className='form-control form-control-solid'
                />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor='lastname' className='required form-label'>
                  Last Name
                </label>
                <input
                  type='text'
                  defaultValue={userData.lastName}
                  {...register('lastname')}
                  className='form-control form-control-solid'
                />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor='email' className='required form-label'>
                  Email
                </label>
                <input
                  type='text'
                  defaultValue={userData.email}
                  {...register('email')}
                  className='form-control form-control-solid'
                />
              </div>
            </div>
            <div className='row mb-0'>
              <div className='col-4 mb-7'>
                <label htmlFor='username' className='required form-label'>
                  Username
                </label>
                <input
                  type='text'
                  defaultValue={userData.username}
                  {...register('username')}
                  className='form-control form-control-solid'
                />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor='password' className='required form-label'>
                  Password (Leave empty if unchanged)
                </label>
                <input
                  type='text'
                  // value={userData.password}
                  {...register('password')}
                  className='form-control form-control-solid'
                />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor='role' className='required form-label'>
                  Role
                </label>
                <select
                  id='role'
                  {...register('role')}
                  defaultValue={userData.roleId}
                  className='form-control form-control-solid'
                  style={{ width: '100%' }}
                >
                  <option value=''></option>
                  {userRoles?.data.map((item: any) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/*  )} */}
        </div>
        <button className='btn btn-primary' onClick={OnSubmit} type='submit'>
          Submit
        </button>
        {/* <Button key='submit' type='primary' htmlType='submit' loading={submitLoading}>
          Submit
        </Button> */}
      </form>
    </div>
  );
};

export { UserEditForm };
