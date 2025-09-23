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
  getAllShortTime,
  addAllShortTime,
} from '../../../../../services/ApiCalls'
import Checkbox from 'antd/es/checkbox/Checkbox'
import TextArea from 'antd/es/input/TextArea'

const HoursExtension = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {data: HoursExtensionData, isLoading: HoursExtensionLoading} = useQuery(
    'HoursExtension',
    getAllShortTime
  )
  const [loadingSubmitHourSetUp, setLoadingSubmitHourSetUp] = useState(false)
  //   const {data: CompanyRoles, isLoading: CompanyRolesLoading} = useQuery('roles', fetchRolesApi)
  const {mutate: addHourExtensionData} = useMutation((values: any) => addAllShortTime(values))
  const {mutate: deleteCompanyData} = useMutation((id: any) => deleteCompany(id))
  const [openNoteModal, setopenHourModal] = useState(false)
  const parms: any = useParams()
  const queryClient = useQueryClient()
  const [HoursExtensionForm] = Form.useForm()
  const showHourModal = () => {
    setopenHourModal(true)
  }

  const cancelHourModal = () => {
    setopenHourModal(false)
  }
  
  const submitHourExtension = (values: any) => {
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure to add this setup?',
      onOk: () => {
        console.log('values', values)

        addHourExtensionData(values, {
          onSuccess: () => {
            message.info('Short time set successfully!')
            queryClient.invalidateQueries('HoursExtension')
            setopenHourModal(false)
            setLoadingSubmitHourSetUp(false)
            HoursExtensionForm.resetFields()
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
      title: 'Hours',
      dataIndex: 'hours',
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
      title: 'Tariff',
      dataIndex: 'tariff',
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
      title: 'Is Charged',
      dataIndex: 'isCharged',
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
      // width: 20,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <button className='btn btn-sm btn-light-primary'>Edit</button>
          <button className='btn btn-sm btn-light-danger'>Delete</button>
        </Space>
      ),
    },
  ]

  const globalSearch = () => {
    // @ts-ignore
    filteredData = dataWithIndex.filter((value) => {
      return (
        value.name.toLowerCase().includes(searchText.toLowerCase()) ||
        value.description.toLowerCase().includes(searchText.toLowerCase()) ||
        value.price.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
  }

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
              <button
                type='button'
                className='btn btn-primary me-3'
                onClick={() => showHourModal()}
              >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>

              {/* <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button> */}
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={HoursExtensionData?.data}
            loading={HoursExtensionLoading}
            className='table-responsive'
          />
        </div>
        <Modal
          open={openNoteModal}
          okText='Ok'
          title='Add Extension Hour'
          closable={true}
          onCancel={cancelHourModal}
          footer={null}
        >
          <Form onFinish={submitHourExtension} form={HoursExtensionForm}>
            <Form.Item
              name={'name'}
              label='Name'
              rules={[{required: true, message: 'Please enter service name'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input type='text' style={{width: '100%'}} />
            </Form.Item>
            <Form.Item
              label='Time'
              rules={[{required: true, message: 'Please enter description'}]}
              name={'hours'}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input type='time' style={{width: '100%'}} />
            </Form.Item>
            <Form.Item
              label='Tariff'
              rules={[{required: true, message: 'Please enter tariff'}]}
              name={'tariff'}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input type='number' style={{width: '100%'}} min={1} />
            </Form.Item>
            <Form.Item wrapperCol={{offset: 2, span: 18}}>
              <Button
                type='primary'
                key='submit'
                htmlType='submit'
                loading={loadingSubmitHourSetUp}
                onClick={() => setLoadingSubmitHourSetUp(true)}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </KTCardBody>
    </div>
  )
}

export {HoursExtension}
