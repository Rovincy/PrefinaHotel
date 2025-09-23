import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './formStyle.css'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Select, Upload, message } from 'antd'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Api_Endpoint, fetchNationalities } from '../../../../services/ApiCalls'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

const GuestEditForm = () => {
  const [fileList, setFileList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { data: NationalityData, isLoading: fetchNationalitiesLoading } = useQuery(
    'Nationality',
    fetchNationalities
  )
  const { register, handleSubmit, reset } = useForm()
  const location = useLocation()
  const guestData: any = location?.state
  const navigate = useNavigate()
  // console.log(guestData?.data)

  // Handle file change for document upload
  const onChange: any = (info: any) => {
    let fileList = [...info.fileList]
    fileList = fileList.slice(-1) // Limit the file list to only one file
    setFileList(fileList)
  }

  const { mutate: updateGuest } = useMutation((values) => axios.put(`${Api_Endpoint}/guests`, values), {
    onSuccess: async () => {
      message.success("Guest updated successfully")        
      setLoading(false)
      navigate('/grm/Guests/', { replace: true })
    },
    onError: (error: any) => {
      console.log(error)
      setLoading(false)
      message.error("Update failed")
    }
  })
  // Submit form data
  const OnSubmit = handleSubmit(async (values: any, event: any) => {
    event?.preventDefault()
    setLoading(true)

    // const formData = new FormData()
    // formData.append('firstName', values.firstName)
    // formData.append('lastname', values.lastname)
    // formData.append('email', values.email)
    // formData.append('gender', values.gender)
    // formData.append('dob', values.dob)
    // formData.append('phoneNumber', values.phoneNumber)
    // formData.append('idType', values.idType)
    // formData.append('nationalityId', values.nationality)
    // formData.append('idNumber', values.idNumber)

    // if (fileList[0]?.originFileObj) {
    //   const file = fileList[0].originFileObj as File
    //   formData.append('file', file)
    // }
    const guestDetails:any = {
      id : guestData?.id,
      firstName : values.firstName,
      lastname : values.lastname,
      phoneNumber : values.phoneNumber,
      email : values.email,
      dob : values.dob,
      gender: values.gender,
      idType : values.idType,
      nationalityId : values.nationality,
      idNumber : values.idNumber
    }

    // try {
    //   const response = await axios.post(`${Api_Endpoint}/guests`, formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //   })
    //   setLoading(false)
    //   reset()
    //   navigate('/grm/Guests/', { replace: true })
    //   message.success('Guest updated successfully!')
    // } catch (error) {
    //   setLoading(false)
    //   message.error('Sorry, this operation failed. Please try again.')
    // }
    try {
      console.log(guestDetails)
      updateGuest(guestDetails)
    } catch (error: any) {
      setLoading(false)
      message.error('Sorry, this operation failed. Please try again.')
      return error.statusText
    }
  })

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
      <Link to='/grm/Guests/'>
        <a
          style={{ fontSize: '16px', fontWeight: '500' }}
          className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
        >
          Back to list
        </a>
      </Link>

      <form onSubmit={OnSubmit}>
        <div className='tab-content'>
          <div className='col-12'>
            {/* First Name and Last Name Inputs */}
            <div className='row mb-0'>
              <div className='col-4 mb-7'>
                <label htmlFor='firstName' className='required form-label'>
                  First Name
                </label>
                <input
                  id='firstName'
                  type='text'
                  {...register('firstName')}
                  className='form-control form-control-solid'
                  defaultValue={guestData?.firstname}
                />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor='lastName' className='required form-label'>
                  Last Name
                </label>
                <input
                  id='lastName'
                  type='text'
                  {...register('lastname')}
                  className='form-control form-control-solid'
                  defaultValue={guestData?.lastname}
                />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor='email' className='required form-label'>
                  Email
                </label>
                <input
                  id='email'
                  type='text'
                  {...register('email')}
                  className='form-control form-control-solid'
                  defaultValue={guestData?.email}
                />
              </div>
            </div>

            {/* Date of Birth and Phone Number Inputs */}
            <div className='row mb-0'>
            <div className='col-4 mb-7'>
  <label htmlFor='dob' className='required form-label'>
    Date of Birth
  </label>
  <input
    id='dob'
    type='date'
    {...register('dob')}
    className='form-control form-control-solid'
    defaultValue={guestData?.dob ? guestData.dob.split('T')[0] : ''} // Ensure the date is in the correct YYYY-MM-DD format
  />
</div>

              <div className='col-4 mb-7'>
                <label htmlFor='phoneNumber' className='required form-label'>
                  Phone Number
                </label>
                <input
                  id='phoneNumber'
                  type='text'
                  {...register('phoneNumber')}
                  className='form-control form-control-solid'
                  defaultValue={guestData?.phoneNumber}
                />
              </div>
            </div>

            {/* Gender, ID Type, Nationality Dropdowns */}
            <div className='row mb-0'>
            <div className='col-4 mb-7'>
  <label htmlFor='gender' className='form-label'>
    Gender
  </label>
  <select
    id='gender'
    {...register('gender')}
    className='form-select form-select-solid'
    defaultValue={guestData?.gender?.trim() || ''} // Use empty string as fallback if guestData?.gender is undefined or null
  >
    <option value=''>Select Gender</option>
    <option value='MALE'>Male</option>
    <option value='FEMALE'>Female</option>
  </select>
</div>

<div className='col-4 mb-7'>
  <label htmlFor='idType' className='form-label'>
    ID Type
  </label>
  <select
    id='idType'
    {...register('idType')}
    className='form-select form-select-solid'
    defaultValue={guestData?.idtype?.trim() || ''} // Ensure .trim() is safe and only called on a string
  >
    <option value=''>Select ID Type</option>
    <option value='PASSPORT'>Passport</option>
    <option value='LICENCE'>Driver's Licence</option>
    <option value='NATIONAL ID'>National ID</option>
  </select>
</div>


              <div className='col-4 mb-7'>
                <label htmlFor='nationality' className='required form-label'>
                  Nationality
                </label>
                <select
                  id='nationality'
                  {...register('nationality')}
                  className='form-select form-select-solid'
                  defaultValue={guestData?.nationalityId || ''}
                >
                  <option value=''>Select Nationality</option>
                  {NationalityData?.data?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ID Number Input */}
            <div className='row mb-0'>
              <div className='col-4 mb-7'>
                <label htmlFor='idNumber' className='form-label'>
                  ID Number
                </label>
                <input
                  id='idNumber'
                  type='text'
                  {...register('idNumber')}
                  className='form-control form-control-solid'
                  defaultValue={guestData?.idnumber}
                />
              </div>
            </div>
          </div>
        </div>

        <Button type='primary' htmlType='submit' loading={loading}>
          Submit
        </Button>
      </form>
    </div>
  )
}

export { GuestEditForm }
