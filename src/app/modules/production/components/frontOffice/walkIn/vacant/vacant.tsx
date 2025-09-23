import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  message,
  DatePicker,
  Collapse,
} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../../../../_metronic/helpers'
import {BASE_URL} from '../../../../urls'
import {FaPlus} from 'react-icons/fa6'
import {employeedata} from '../../../../../../data/DummyData'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import moment from 'moment'
import GuestCheckinApi, {
  Api_Endpoint,
  fetchGuests,
  fetchBookings,
  fetchRooms,
  GuestCheckoutApi,
  addBookingApi,
  fetchServiceDetailsApi,
  addGuestServiceApi,
  fetchGuestServiceApi,
  currencyConverterApi,
  updateGuestApi,
  checkRoomAvailability,
  saveTransfer,
  nightAudit,
  auditTrail,
  fetchVacantRooms,
} from '../../../../../../services/ApiCalls'
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns/src/drop-down-list/dropdownlist.component'
import TextArea from 'antd/es/input/TextArea'
import {useForm} from 'react-hook-form'
import {Console} from 'console'
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars'
import {useAuth} from '../../../../../auth'
import {render} from 'react-dom'
interface Booking {
  BookStart: Date | null
  BookEnd: Date | null
}

interface RoomData {
  roomId?: number
  roomName?: string
  bookings?: Booking[]
  bookingCount?: number
}
const Vacant = () => {
  const Option: any = Select.Option
  const [gridData, setGridData] = useState<any>([])
  const [newSearchedData, setNewSearchedData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [formCurrency] = Form.useForm()
  const [img, setImg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const {data: getNotes, isLoading: NotesLoad} = useQuery('Notes', fetchNotes)
  const {data: getGuests, isLoading: GetGuestsLoad} = useQuery('Guests', fetchGuests)
  const {data: roomsdata, isLoading: GetRoomsLoad} = useQuery('rooms', fetchRooms)
  const {data: bookingData, isLoading: BookingsLoad} = useQuery('Bookings', fetchBookings)
  const {data: servicesDetails} = useQuery('fetchServicesDetails', fetchServiceDetailsApi)
  const {mutate: checkGuestInQuery} = useMutation((values: any) => GuestCheckinApi(values))

  const {mutate: updatePayment} = useMutation((serviceId: any) => updateGuestApi(serviceId))
  const [isOpen, setIsOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const {mutate: addReservation} = useMutation((values: any) => addBookingApi(values))
  const queryClient = useQueryClient()
  const {mutate: checkGuestOutQuery} = useMutation((values: any) => GuestCheckoutApi(values))
  const {mutate: runNightAudit} = useMutation((values: any) => nightAudit(values))
  // const {mutate: checkGuestInQuery} = useMutation((values: any) => GuestCheckinApi(values))
  const [openAddServiceModal, setopenAddServiceModal] = useState(false)
  const [openTransferModal, setopenTransferModal] = useState(false)
  const [openGenerateModal, setopenGenerateModal] = useState(false)
  const {mutate: addGuestService} = useMutation((values: any) => addGuestServiceApi(values))
  const {mutate: addAuditTrail} = useMutation((values: any) => auditTrail(values))
  const {mutate: checkIfAvailability} = useMutation((values: any) => checkRoomAvailability(values))
  const {mutate: submitRoomTransfer} = useMutation((values: any) => saveTransfer(values))
  const vacantRoomsData: RoomData[] = []
  const {data: fetchVacantRoomsData, isLoading: fetchVacantRoomsLoading} = useQuery(
    'fetchVacantRoomsQuery',
    fetchVacantRooms
  )
  const [priceValue, setpriceValue] = useState<any>()
  const [quantityValue, setQuantityValue] = useState<any>()
  const [addBookingForm] = Form.useForm()
  const [totalprice, setTotalPrice] = useState(0)
  const [serviceData, setServiceData] = useState<any>({})
  const [allServiceData, setAllServiceData] = useState<any>([])
  const roomsOptions: any = []
  const servicesOptions: any = []
  const [allServicesArr, setallServicesArr] = useState<any>([])
  const [bookingId, setBookingId] = useState(0)
  const [guestroomId, setRoomId] = useState()
  const [guestId, setGuestId] = useState()
  const [spinner, setSpinner] = useState(true)
  const [serviceBillData, setServiceBillData] = useState<any>([])
  const [paidServiceData, getPaidServiceData] = useState<any>([])
  const [servicePaymentData, setServicePaymentData] = useState<any>([])
  const [totalGuestBill, setTotalBill] = useState(0)
  const {currentUser, logout} = useAuth()
  const {Panel} = Collapse

  let totalBill = 0

  roomsdata?.data.map((item: any) => {
    roomsOptions.push({value: item.id, label: item.name})
  })
  servicesDetails?.data.map((item: any) => {
    servicesOptions.push({value: item.id, label: item.name})
  })
  const [serviceForm] = Form.useForm()
  const [transferForm] = Form.useForm()
  const [isUnAvailable, setCheckUnAvailability] = useState(true)
  const [formData, setFormData] = useState({
    roomId: null, // Initialize with default values or null as needed
    bookEnd: null,
    prv_roomId: null,
    customerId: null,
    // bookStart:null,
    // prv_bookEnd:null,
    id: null,
  })
  const [auditTrailData, setAuditTrailData] = useState({
    userId: null,
    description: null,
  })
  var tableValue: any
  const convertFromCedis = (e: any) => {
    let amount = 0
    currencyConverterApi('GHS', 'USD').then((res) =>
      formCurrency.setFieldValue('To', res.data.rates.USD * e.target.value)
    )
  }
  // convert form Us dollar
  const convertFromDollar = (e: any) => {
    currencyConverterApi('USD', 'GHS').then((res) =>
      formCurrency.setFieldValue('From', res.data.rates.GHS * e.target.value)
    )
  }

  const guestList = getGuests?.data.map((e: any) => {
    // console.log('e',e?.firstname+' '+e?.lastname)
    return {
      id: e?.id,
      name: e?.firstname + ' ' + e?.lastname,
    }
  })
  const roomList = roomsdata?.data
  // console.log('room list', roomList)

  const guestsData = getGuests?.data

  const data = bookingData?.data.map((e: any) => {
    const guest = guestsData?.find((x: any) => {
      // console.log("x", x)

      if (x.id === e.guestId) {
        return x
      }
    })

    const room = roomList?.find((x: any) => {
      // console.log("x", x)
      // console.log("e", e)

      if (x.id === e.roomId) {
        return x
      }
    })

    var checkinTimeData = new Date(e?.checkInTime)

    var bookStartTime = new Date(e?.bookStart)
    var bookEndTime = new Date(e?.bookEnd)
    // formattedDate = moment(bookEndTime).format('YYYY-MM-DD HH:mm:ss');
    return {
      id: e?.id,
      guest: `${guest?.firstname?.trim()} ${guest?.lastname}`,
      room: room?.name,
      roomId: room?.id,
      guestId: guest?.id,
      bookStart: bookStartTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      bookEnd: bookEndTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        // year: 'numeric',
        // month: '2-digit',
        // day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit',
      }),
      checkInTime: e?.checkInTime
        ? checkinTimeData.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : e?.checkInTime,
      checkOutTime: e?.checkOutTime,
    }
  })

  const newFilteredData = data?.filter((e: any) => {
    // console.log('newFilteredData data: '+e)
    return e.checkOutTime == null && e.checkInTime != null
  })

  const newReservationData = data?.filter((e: any) => {
    // console.log('newFilteredData: '+e)
    return e.checkOutTime == null && e.checkInTime == null
  })

  const cancelBillModal = () => {
    setopenGenerateModal(false)
  }
  const cancelTransferModal = () => {
    setopenTransferModal(false)
    setCheckUnAvailability(true)
    transferForm.resetFields()
  }
  var selectedItemBookEnd: any
  var customerId
  var prv_roomId
  var id
  const displayTransferModal = (value: any) => {
    // const { roomId, bookEnd } = formData;
    tableValue = value
    // console.log(tableValue)
    // console.log('tableValue: ', tableValue['bookStart'])
    // console.log('tableValue: ', tableValue['bookEnd'])
    selectedItemBookEnd = tableValue['bookEnd']
    // formData.bookStart = tableValue['bookStart']
    formData.customerId = tableValue['guestId']
    formData.prv_roomId = tableValue['roomId']
    formData.id = tableValue['id']
    // console.log('selectedItemBookEnd: ', selectedItemBookEnd)
    setopenTransferModal(true)
  }

  const vacantRoomsColumns: any = [
    {
      title: 'Guest',
      dataIndex: 'guestName',
      // sorter: (a: any, b: any) => {
      //   if (a.room > b.room) {
      //     return 1
      //   }
      //   if (b.room > a.room) {
      //     return -1
      //   }
      //   return 0
      // },
    },
    {
      title: 'Book Start',
      dataIndex: 'bookStart',
      render: (bookStart: any) => {
        if (bookStart) {
          const date = new Date(bookStart)
          const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}-${date.getFullYear()} ${date
            .getHours()
            .toString()
            .padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
          return formattedDate
        }
        return null
      },
    },
    {
      title: 'Book End',
      dataIndex: 'bookEnd',
      render: (bookEnd: any) => {
        if (bookEnd) {
          const date = new Date(bookEnd)
          const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}-${date.getFullYear()} ${date
            .getHours()
            .toString()
            .padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
          return formattedDate
        }
        return null
      },
    },

    {
      title: 'Action',
      fixed: 'right',
      // width: 20,
      render: (_: any, record: any) => {
        return currentUser?.role.toString().toLocaleLowerCase() === 'admin' ? (
          <Space size='middle'>
            <a
              href='#'
              className='btn btn-light-primary btn-sm'
              onClick={() =>
                checkGuestIn({
                  id: record.bookingId,
                  CheckInOutTime: new Date(),
                  // checkInOutTime: new Date(),
                })
              }
            >
              CheckIn
            </a>
          </Space>
        ) : null
      },
    },
  ]
  const columns: any = [
    {
      title: 'Room',
      dataIndex: 'roomName',
      // sorter: (a: any, b: any) => {
      //   if (a.room > b.room) {
      //     return 1
      //   }
      //   if (b.room > a.room) {
      //     return -1
      //   }
      //   return 0
      // },
    },
    {
      // dataIndex: 'room',

      render(record: any) {
        // const { expandIconPosition } = this.state;
        return (
          <div>
            <Collapse
              // defaultActiveKey={['1']}
              // onChange={callback}
              // expandIconPosition={expandIconPosition}
              // bordered={false}
              expandIcon={() => (
                <div>
                  <FaPlus />
                </div>
              )}
              ghost={true}
            >
              <Panel header='View Booking List' key='1'>
                <div>
                  <Table
                    columns={vacantRoomsColumns}
                    dataSource={record?.bookings ? record?.bookings : []}
                    //  dataSource={newFilteredData}
                    loading={BookingsLoad}
                    className='table-responsive'
                  />
                </div>
              </Panel>
            </Collapse>
          </div>
        )
      },
    },

    {
      title: 'Action',
      fixed: 'right',
      // width: 20,
      render: (_: any, record: any) => {
        return currentUser?.role.toString().toLowerCase() === 'admin' ? (
          <Space size='middle'>
            <a
              href='#'
              className='btn btn-light-primary btn-sm'
              onClick={() => displayTransferModal(record)}
            >
              {`Bookings (${record?.bookingCount})`}
            </a>
          </Space>
        ) : null
      },
    },
  ]

  // const {data:allNotes} = useQuery('Notes', fetchNotes, {cacheTime:5000})

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Api_Endpoint}/RoomsType`)
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      // console.log(error)
    }
  }
  const checkGuestOut = (guestData: any) => {
    if (guestData.checkInTime === null) {
      message.info('Please, check In before you check out!')
      return
    }

    Modal.confirm({
      okText: 'Confirm',
      okType: 'primary',
      title: 'Kindly confirm check-out!',
      onOk: () => {
        checkGuestOutQuery(guestData, {
          onSuccess: () => {
            message.success('Guest successfully ckecked out!')
            queryClient.invalidateQueries('Bookings')
            queryClient.invalidateQueries('Guests')
            queryClient.invalidateQueries('rooms')
          },
        })
      },
    })
  }
  const checkGuestIn = (guestData: any) => {
    Modal.confirm({
      okText: 'Confirm',
      okType: 'primary',
      title: 'Kindly confirm check-In!',
      onOk: () => {
        checkGuestInQuery(guestData, {
          onSuccess: () => {
            message.success('Guest successfully ckecked in!')
            queryClient.invalidateQueries('fetchVacantRoomsQuery')
          },
        })
      },
    })
  }

  useEffect(() => {
    loadData()
    // console.log('newFilteredData: ',newFilteredData)
    setNewSearchedData(newFilteredData)
    // fetchImage()
  }, [])

  useEffect(() => {
    // loadData()
    setNewSearchedData(newFilteredData)
    // fetchImage()
  }, [newFilteredData])

  // const sortedEmployees = gridData.sort((a:any, b:any) => a?.departmentId.localeCompare(b?.departmentId));
  // const females = sortedEmployees.filter((employee:any) => employee.gender === 'female');

  var out_data: any = {}

  gridData.forEach(function (row: any) {
    if (out_data[row.departmentId]) {
      out_data[row.departmentId].push(row)
    } else {
      out_data[row.departmentId] = [row]
    }
  })

  const handleInputChange = (e: any) => {
    globalSearch(e.target.value)
    if (e.target.value === '') {
      loadData()
    } /*else{
          newFilteredData.filter(
            (item: { room: string })=> item.room?.toLowerCase().includes(e.target.value?.toLowerCase())
          );
        }*/
  }


 

  const addCheckIn = () => {
    setIsOpen(true)
    addBookingForm.resetFields()
  }
  const globalSearch = (searchedValue: any) => {
    // console.log('searchedValue: '+searchedValue)
    // @ts-ignore
    filteredData = newFilteredData.filter((Filteredvalue) => {
      return (
        Filteredvalue.guest?.toLowerCase().includes(searchedValue?.toLowerCase()) ||
        Filteredvalue.room?.toLowerCase().includes(searchedValue?.toLowerCase())
      )
    })
    // console.log('Filtered Data: '+filteredData)
    // setGridData(filteredData)
    setNewSearchedData(filteredData)
  }

  return (
    // <div
    //   style={{
    //     backgroundColor: 'white',
    //     padding: '20px',
    //     borderRadius: '5px',
    //     boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
    //   }}
    // >
    <div
      style={{
        // width:'50%',
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
              <Input
                placeholder='Enter Search Text'
                onChange={handleInputChange}
                type='text'
                allowClear
                // value={searchText}
              />
              {/* <Button type='primary' onClick={globalSearch}>
                    Search
                  </Button> */}
            </Space>

            <Space style={{marginBottom: 16}}>
              <button
                type='button'
                className='btn btn-light-primary me-3'
                onClick={() => addCheckIn()}
              >
                Add
              </button>
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={fetchVacantRoomsData?.data}
            //  dataSource={newFilteredData}
            loading={fetchVacantRoomsLoading}
            className='table-responsive'
          />
        </div>
      </KTCardBody>
    </div>
  )
}

export {Vacant}
