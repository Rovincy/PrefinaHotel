import {Button, Form, Input, InputNumber, Modal, Space, Table, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../../../_metronic/helpers'
import {BASE_URL} from '../../../urls'
import {Link, useParams} from 'react-router-dom'
// import { employeedata } from '../../../../../data/DummyData'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {
  Api_Endpoint,
  addServiceApi,
  deleteServiceiceCategoryApi,
  deleteUserApi,
  fetchRolesApi,
  fetchRooms,
  fetchServiceCategoryApi,
  fetchCompanies,
  deleteCompany,
  companyDeposit,
} from '../../../../../services/ApiCalls'
import Checkbox from 'antd/es/checkbox/Checkbox'
import TextArea from 'antd/es/input/TextArea'
import {render} from 'react-dom'
import {CompanyForm} from './companyForm'

const Company = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [openDepositModal, setOpenDepositModal] = useState(false)
  const {data: CompanyData, isLoading: CompanyLoading} = useQuery('Company', fetchCompanies)
  //   const {data: CompanyRoles, isLoading: CompanyRolesLoading} = useQuery('roles', fetchRolesApi)
  const {mutate: addCategoryData} = useMutation((values: any) => addServiceApi(values))
  const {mutate: deleteCompanyData} = useMutation((id: any) => deleteCompany(id))
  const {mutate: updateCompanyData} = useMutation((values: any) => companyDeposit(values))
  const [openNoteModal, setopenNoteModal] = useState(false)
  const parms: any = useParams()
  const queryClient = useQueryClient()
  const [categoryForm] = Form.useForm()
  const [depositForm] = Form.useForm()
  const showModal = () => {
    setopenNoteModal(true)
  }

  const deleteUser = (id: any) => {
    
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to delete this company?',
      onOk: () => {
        deleteCompanyData(id, {
          onSuccess: () => {
            message.info('Company deleted successfully!')
            queryClient.invalidateQueries('Company')
          },
        })
      },
    })
  }

  //   const roles = CompanyRoles?.data

  // console.log(userAndRoles)

  const cancelNoteModal = () => {
    setopenNoteModal(false)
  }
  const openModalForDeposit = (record: any) => {
    depositForm.setFieldsValue({id: record.id})
    //form.resetFields()
    setOpenDepositModal(true)
  }
  const cancelDepositMoneyModal = () => {
    setOpenDepositModal(false)
  }
  const submitDeposit = (values: any) => {
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to deposit this amount?',
      onOk: () => {
        updateCompanyData(values, {
          onSuccess: () => {
            message.info('Money deposited successfully!')
            queryClient.invalidateQueries('Company')
            setOpenDepositModal(false)
            depositForm.resetFields()
          },
        })
      },
    })
  }
  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${BASE_URL}/RoomsType`)
      // update the local state so that react can refecth and re-render the table with the new data
      const newData = gridData.filter((item: any) => item.id !== element.id)
      setGridData(newData)
      return response.status
    } catch (e) {
      return e
    }
  }

  function handleDelete(element: any) {
    deleteData(element)
  }
  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Tin Number',
      dataIndex: 'tinNumber',
      sorter: (a: any, b: any) => {
        if (a.tinNumber > b.tinNumber) {
          return 1
        }
        if (b.tinNumber > a.tinNumber) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a: any, b: any) => {
        if (a.description > b.description) {
          return 1
        }
        if (b.description > a.description) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      sorter: (a: any, b: any) => {
        if (a.phoneNumber > b.phoneNumber) {
          return 1
        }
        if (b.phoneNumber > a.phoneNumber) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Non Taxable',
      dataIndex: 'nonTaxable',
      render: (nonTaxable: boolean) => <Checkbox checked={nonTaxable} />,
      sorter: (a: any, b: any) => {
        if (a.nonTaxable > b.nonTaxable) {
          return 1
        }
        if (b.nonTaxable > a.nonTaxable) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Fix Rate',
      dataIndex: 'fixRate',
      sorter: (a: any, b: any) => {
        if (a.fixRate > b.fixRate) {
          return 1
        }
        if (b.fixRate > a.fixRate) {
          return -1
        }
        return 0
      },
    },
    
    
    {
      title: 'Action',
      fixed: 'right',
      width: 20,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Link to={`/Company/companyEditForm/`} state={record}>
            <a href='#' className='btn btn-light-primary btn-sm'>
              Edit
            </a>
          </Link>
          

          <a href='#' className='btn btn-light-danger btn-sm' onClick={() => deleteUser(record.id)}>
            Delete
          </a>
        </Space>
      ),
    },
  ]



  return (
  
    <div
      style={{
        width: '100%',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
          <div className='d-flex justify-content-between'>
            <Space style={{marginBottom: 16}}>
              {/* <Input placeholder='Enter Search Text' type='text' allowClear value={searchText} />
              <Button type='primary' onClick={globalSearch}>
                Search
              </Button> */}
            </Space>
            <Space style={{marginBottom: 16}}>
              <Link to='/Company/CompanyForm'>
                <button type='button' className='btn btn-primary me-3'>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Add
                </button>
              </Link>

              {/* <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button> */}
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={CompanyData?.data}
            loading={CompanyLoading}
            className='table-responsive'
          />
        </div>
        
        <Modal
          open={openDepositModal}
          okText='Ok'
          title='Deposit Money'
          closable={true}
          onCancel={cancelDepositMoneyModal}
          footer={null}
        >
          <Form onFinish={submitDeposit} form={depositForm}>
            <Form.Item
              name={'id'}
              label='Id'
              rules={[{required: true, message: 'Id is required'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
              hidden
            >
              <Input type='number' style={{width: '100%'}} min={1} />
            </Form.Item>
            <Form.Item
              name={'Credit'}
              label='Amount'
              rules={[{required: true, message: 'Please enter amount'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input type='number' style={{width: '100%'}} min={1} />
            </Form.Item>
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key='cancel' className='me-3'>
                Cancel
              </Button>
              <Button key='confirm' type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </Modal>
      </KTCardBody>
    </div>
  )
}

export {Company}
