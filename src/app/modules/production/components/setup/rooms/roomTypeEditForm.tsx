import {useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
// import "./formStyle.css"
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface'
import {UploadOutlined} from '@ant-design/icons'
import {Button, message, Upload} from 'antd'
import {
  BANKS,
  CATEGORY,
  DEPARTMENTS,
  DIVISION,
  GRADES,
  NOTCHES,
  NOTES,
  PAYGROUP,
  UNITS,
} from '../../../../../data/DummyData'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {Api_Endpoint} from '../../../../../services/ApiCalls'
// import { Api_Endpoint, fetchCategories, fetchDepartments, fetchDivisions, fetchGrades, fetchJobTitles, fetchNationalities, fetchNotches, fetchPaygroups, fetchUnits } from '../../../../services/ApiCalls';
import {useQuery} from 'react-query'
import {useNavigate, Navigate} from 'react-router-dom'

const RoomTypeEditForm = () => {
  const [formData, setFormData] = useState({})
  //   const [activeTab, setActiveTab] = useState('tab1');
  const {register, reset, handleSubmit, formState: { errors }} = useForm()
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  //   const handleTabClick = (tab:any) => {
  //     setActiveTab(tab);
  //   }
  const location = useLocation();
  const roomTypeData = location?.state;
  const navigate = useNavigate()

  // const {data:allDepartments} = useQuery('departments', fetchDepartments, {cacheTime:5000})
  // const {data:allDivisions} = useQuery('divisions', fetchDivisions, {cacheTime:5000})
  // const {data:allCategories} = useQuery('categories', fetchCategories, {cacheTime:5000})
  // const {data:allPaygroups} = useQuery('paygroups', fetchPaygroups, {cacheTime:5000})
  // const {data:allUnits} = useQuery('units', fetchUnits, {cacheTime:5000})
  // const {data:allGrades} = useQuery('grades', fetchGrades, {cacheTime:5000})
  // const {data:allNotches} = useQuery('notches', fetchNotches, {cacheTime:5000})
  // const {data:allNations} = useQuery('nations', fetchNationalities, {cacheTime:5000})
  // const {data:allJobTitles} = useQuery('jobtitle', fetchJobTitles, {cacheTime:5000})

  //   const handleTabChange = (newTab:any) => {
  //     setActiveTab(newTab);
  //   }

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const onChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
    setFileList(newFileList)
  }

  // to preview the uploaded file
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const url = `${Api_Endpoint}/roomsType`
  const OnSUbmit = handleSubmit(async (values, event) => {
    event?.preventDefault()
    setLoading(true)
    // const data = {
    //   id: roomTypeData.id,
    //   name: values.name,
    //   description: values.description,
    //   price: values.price
    // }
    // const data = {
    //   name: values.name,
    //   description: values.description,
    //   price: values.price,
    //   // dob: values.dob,
    //   // gender: values.gender,
    //   // email: values.email,
    //   // maritalStatus: values.maritalStatus,
    //   // nationality: values.nationalId,
    //   // nationalId: values.nationalId,
    //   // phone: values.phone,
    //   // alternativePhone: values.alternativePhone,
    //   // address: values.address,
    //   // residentialAddress: values.residentialAddress,
    //   // personalEmail: values.personalEmail,
    //   // nextOfKin: values.nextOfKin,
    //   // guarantor: values.guarantor,
    //   // paygroupId: parseInt(values.paygroupId),
    //   // categoryId: parseInt(values.categoryId),
    //   // divisionId: parseInt(values.divisionId),
    //   // departmentId: parseInt(values.departmentId),
    //   // gradeId: parseInt(values.gradeId),
    //   // notchId: parseInt(values.notchId),
    //   // employmentDate: values.employmentDate,
    //   // payType: values.payType,
    //   // paymentMethod: selectedPaymentMethod,
    //   // bankId: parseInt(values.bankId),
    //   // account: values.account,
    //   // tin: values.tin,
    //   // ssf: values.ssf,
    // }
    try {
          const formData = new FormData();
          formData.append('id', roomTypeData.id);
          formData.append('name', values.name);
          formData.append('description', values.description);
          formData.append('price', values.price);
          if (fileList[0]?.originFileObj) {
            formData.append('file', fileList[0].originFileObj as File);
          }
    
          const response = await axios.put(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
    
          message.success('Room updated successfully');
          reset();
          setFileList([]);
          // setIsActive(false);
          navigate(`/roomType`, { replace: true });
        } catch (error: any) {
          console.error('Error updating room type:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
          });
          const errorMessage = error.response?.data || 'Failed to update room type. Please try again.';
          message.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        } finally {
          setLoading(false);
        }
    // console.log(data)
    // try {
      
    //   const response = await axios.put(url, data)
    //   setSubmitLoading(false)
    //   reset()
    //   navigate('/roomType', {replace: true})
    //   // loadData()
    //   // console.log(response.status) response.status===201? <Navigate to="/employee"/>:
    //   return response.statusText
    // } catch (error: any) {
    //   setSubmitLoading(false)
    //   console.log(error.message);
      
    //   return error.statusText
      
    // }
  })
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
  return (
    <div
      className='col-12'
      style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '5px',

        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <Link to='/roomType'>
        <a
          style={{fontSize: '16px', fontWeight: '500'}}
          className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
        >
          Back to room type
        </a>
      </Link>
      <form onSubmit={OnSUbmit}>
        <div className='tab-content'>
          {/* Details */}
          {
            <div className='col-12'>
              <div className='row mb-0'>
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
              
            </div>
              <div className='row mb-0'>
                <div className='col-4 mb-7'>
                  <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    Name
                  </label>
                  <input
                    type='text'
                    {...register('name')}
                    defaultValue={roomTypeData?.name.trim()}
                    className='form-control form-control-solid'
                  />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    Description
                  </label>
                  <input
                    type='text'
                    {...register('description')}
                    defaultValue={roomTypeData?.description.trim()}
                    className='form-control form-control-solid'
                  />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    Price
                  </label>
                  <input
                    type='text'
                    {...register('price')}
                    defaultValue={roomTypeData?.price}
                    className='form-control form-control-solid'
                  />
                </div>
              </div>
            </div>
          }
        </div>
        {/* <button className='btn btn-primary' onClick={OnSUbmit} type='submit'>
          Submit
        </button> */}
        <Button onClick={OnSUbmit} type='primary' loading={loading}>Submit</Button>
      </form>
    </div>
  )
}

export {RoomTypeEditForm}
