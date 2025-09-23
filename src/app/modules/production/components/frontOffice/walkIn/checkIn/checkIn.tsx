import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tabs,
  message,
  DatePicker,
} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody} from '../../../../../../../_metronic/helpers'
import {Link, useNavigate} from 'react-router-dom'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import dayjs from 'dayjs'
import GuestCheckinApi, {
  Api_Endpoint,
  fetchGuests,
  fetchBookings,
  fetchRooms,
  fetchRoomsBy,
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
  extendBookingDate,
  getAllShortTime,
  extendShortTimeApi,
} from '../../../../../../services/ApiCalls'
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns/src/drop-down-list/dropdownlist.component'
import {useAuth} from '../../../../../auth'
import CheckInAddService from './CheckInAddService'
import CheckInExtendBookingDate from './CheckInExtendBookingDate'
import CheckInSelectNewRoom from './CheckInSelectNewRoom'
import {useForm} from 'react-hook-form'

const CheckIn = () => {
  // CONST VALUES //
  var tableValue: any
  const roomsOptions: any = []
  const servicesOptions: any = []
  // CONST VALUES //

  // LET VALUES //
  let totalBill = 0
  let selectedExtendBookEnd: string | number | Date | dayjs.Dayjs | null | undefined
  let selectedExtendBookEndHour: string | number | Date | dayjs.Dayjs | null | undefined
  // LET VALUES //

  // SELECT.OPTION //
  const Option: any = Select.Option
  // SELECT.OPTION //

  // USEMESSAGE //
  const [messageApi, contextHolder] = message.useMessage()
  // USEMESSAGE //

  // USEFORM //
  const [extendBookEndForm] = Form.useForm()
  const [formCurrency] = Form.useForm()
  const [addBookingForm] = Form.useForm()
  const [serviceForm] = Form.useForm()
  const [transferForm] = Form.useForm()
  // USEFORM //
  const [form] = Form.useForm()
  // USEQUERYCLIENT //
  const queryClient = useQueryClient()
  // USEQUERYCLIENT //

  // USEQUERY //
  const {data: getGuests, isLoading: GetGuestsLoad} = useQuery('Guests', fetchGuests)
  const {data: roomsdata, isLoading: GetRoomsLoad} = useQuery('rooms', fetchRooms)
  const {data: roomsdataby, isLoading: GetRoomsByLoad} = useQuery('roomsby', fetchRoomsBy)
  const {data: bookingData, isLoading: BookingsLoad} = useQuery('Bookings', fetchBookings)
  const {data: servicesDetails} = useQuery('fetchServicesDetails', fetchServiceDetailsApi)
  const {data: fetchGuestServiceData, isLoading: fetchGuestServiceLoading} = useQuery(
    'fetchGuestServiceQuery',
    fetchGuestServiceApi
  )
  // USEQUERY //

  // USEMUTATION //
  const {mutate: addReservation} = useMutation((values: any) => addBookingApi(values))
  const {mutate: extendShortime} = useMutation((values: any) => extendShortTimeApi(values))
  const {mutate: checkGuestInQuery} = useMutation((values: any) => GuestCheckinApi(values))
  const {mutate: extendBookEndQuery} = useMutation((values: any) => extendBookingDate(values))
  const {mutate: updatePayment} = useMutation((serviceId: any) => updateGuestApi(serviceId))
  const {mutate: checkGuestOutQuery} = useMutation((values: any) => GuestCheckoutApi(values))
  const {mutate: runNightAudit} = useMutation((values: any) => nightAudit(values))
  const {mutate: addGuestService} = useMutation((values: any) => addGuestServiceApi(values))
  const {mutate: addAuditTrail} = useMutation((values: any) => auditTrail(values))
  const {mutate: checkIfAvailability} = useMutation((values: any) => checkRoomAvailability(values))
  const {mutate: submitRoomTransfer} = useMutation((values: any) => saveTransfer(values))
  const {data: getAllShortTimeData, isLoading: getAllShortTimeLoading} = useQuery(
    'allShortTime',
    getAllShortTime
  )
  // USEMUTATION //

  // USESTATE //
  const [isOpen, setIsOpen] = useState(false)
  const [img, setImg] = useState()
  const [gridData, setGridData] = useState<any>([])
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [newSearchedData, setNewSearchedData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')

  const [totalprice, setTotalPrice] = useState(0)
  const [serviceData, setServiceData] = useState<any>({})
  const [allServiceData, setAllServiceData] = useState<any>([])
  const [quantityValue, setQuantityValue] = useState<any>()
  const [priceValue, setpriceValue] = useState<any>()
  const [bookingId, setBookingId] = useState(0)
  
  const [guestroomId, setRoomId] = useState()
  const [guestId, setGuestId] = useState()
  const [spinner, setSpinner] = useState(true)
  const [serviceBillData, setServiceBillData] = useState<any>([])
  const [paidServiceData, getPaidServiceData] = useState<any>([])
  const [allServicesArr, setallServicesArr] = useState<any>([])
  const [servicePaymentData, setServicePaymentData] = useState<any>([])
  const [totalGuestBill, setTotalBill] = useState(0)
  const [openAddServiceModal, setopenAddServiceModal] = useState(false)
  const [openTransferModal, setopenTransferModal] = useState(false)
  const [openGenerateModal, setopenGenerateModal] = useState(false)
  const [openExtendModal, setopenExtendModal] = useState(false)
  const [isUnAvailable, setCheckUnAvailability] = useState(true)
  const [auditTrailData, setAuditTrailData] = useState({userId: null, description: null})
  const [activeLink, setActiveTab] = useState<number>(1)
  const [formData, setFormData] = useState({
    roomId: null,
    bookEnd: null,
    prv_roomId: null,
    customerId: null,
    id: null,
    customerReceiptNumber: null,
    companyId: null,
    price: null,
  })
  // USESTATE //

  // USEAUTH //
  const {currentUser, logout} = useAuth()
  // USEAUTH //

  // USENAVIGATE //
  const navigate = useNavigate()
  // USENAVIGATE //

  // API CALLING //
  roomsdata?.data.map((item: any) => {
    roomsOptions.push({value: item.id, label: item.name})
  })
  servicesDetails?.data.map((item: any) => {
    servicesOptions.push({value: item.id, label: item.name})
  })
  // API CALLING //

  // convertFromCedis //
  const convertFromCedis = (e: any) => {
    let amount = 0
    currencyConverterApi('GHS', 'USD').then((res) =>
      formCurrency.setFieldValue('To', res.data.rates.USD * e.target.value)
    )
  }
  // convertFromCedis //

  // convertFromDollar //
  const convertFromDollar = (e: any) => {
    currencyConverterApi('USD', 'GHS').then((res) =>
      formCurrency.setFieldValue('From', res.data.rates.GHS * e.target.value)
    )
  }
  // convertFromDollar //

  // CONST VALUES THAT CALL API DATA //
  const roomList = roomsdata?.data
  const guestsData = getGuests?.data
  const data = bookingData?.data.map((e: any) => {
    const guest = guestsData?.find((x: any) => {
      if (x.id === e.guestId) {
        return x
      }
    })

    const room = roomList?.find((x: any) => {
      if (x.id === e.roomId) {
        return x
      }
    })

    var checkinTimeData = new Date(e?.checkInTime)
    var bookStartTime = new Date(e?.bookStart)
    var bookEndTime = new Date(e?.bookEnd)

    return {
      id: e?.id,
      price: e?.price,
      guest: `${guest?.firstname?.trim()} ${guest?.lastname}`,
      room: room?.name,
      roomId: room?.id,
      guestId: guest?.id,
      formattedBookend: bookEndTime,
      formattedBookstart: bookStartTime,
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
    return e.checkOutTime == null && e.checkInTime != null
  })
  const newReservationData = data?.filter((e: any) => {
    
    return e.checkOutTime == null && e.checkInTime == null
  })
  console.log('e',newReservationData)
  // CONST VALUES THAT CALL API DATA //

  // CANCEL MODAL //
  const cancelBillModal = () => {
    setopenGenerateModal(false)
  }
  const cancelTransferModal = () => {
    setopenTransferModal(false)
    setCheckUnAvailability(true)
    transferForm.resetFields()
  }
  // CANCEL MODAL //

  // VAR //
  var selectedItemBookEnd: any
  var customerId
  var prv_roomId
  var id
  // VAR //

  // displayTransferModal //
  const displayTransferModal = (value: any) => {
    tableValue = value
    selectedItemBookEnd = tableValue['bookEnd']
    formData.customerId = tableValue['guestId']
    formData.prv_roomId = tableValue['roomId']
    formData.id = tableValue['id']
    setopenTransferModal(true)
  }
  // displayTransferModal //

  // FUNCTION extendBookOnFinish //
  function extendBookOnFinish(values: any) {
    console.log('values', values)
    extendBookEndQuery(values, {
      onSuccess: () => {
        queryClient.invalidateQueries('Bookings')
        queryClient.invalidateQueries('rooms')
        setopenExtendModal(false)
        message.success('Booking extended successfully!')
      },
      onError: () => {
        message.success('Extending Booking  failed!')
      },
    })
  }
  // FUNCTION extendBookOnFinish //

  // handlePayment //
  const handlePayment = () => {
    Modal.confirm({
      title: 'Are you sure, you want to make payment for the selected items?',
      okText: 'Pay',
      onOk: () => {
        serviceBillData.map((item: any) => {
          if (
            servicePaymentData.some(
              (selectedItem: {serviceId: any}) => selectedItem.serviceId === item.id
            )
          ) {
            const serviceId = parseInt(item.id)
            updatePayment(serviceId, {
              onSuccess: () => {
                message.success('Payment made successfully!')
                setopenGenerateModal(false)
                queryClient.invalidateQueries('Bookings')
                queryClient.invalidateQueries('fetchGuestServiceQuery')
                queryClient.invalidateQueries('Guests')
                queryClient.invalidateQueries('rooms')
                queryClient.invalidateQueries('fetchServicesDetails')
              },
              onError(error, variables, context) {
                message.destroy('Error occurred while submitting payment')
              },
            })
          }
        })
      },
    })
  }
  // handlePayment //

  // handleOk //
  const handleOk = () => {
    Modal.confirm({
      okText: 'Add',
      okType: 'primary',
      title: 'Are you sure, you want to add this service?',
      onOk: () => {
        allServiceData.map((item: any) => {
          console.log('item', item)
          item.totalPrice = item.price * item.quantity
          const {userId, description} = auditTrailData

          addGuestService(item, {
            onSuccess: () => {
              var data = {
                userId: currentUser?.id,
                description: 'Added new service',
              }
              addAuditTrail(data, {
                onSuccess: () => {
                  message.success('Service added successfully!')
                  setopenAddServiceModal(false)
                  queryClient.invalidateQueries('Bookings')
                  queryClient.invalidateQueries('fetchGuestServiceQuery')
                  queryClient.invalidateQueries('Guests')
                  queryClient.invalidateQueries('rooms')
                  queryClient.invalidateQueries('fetchServicesDetails')
                  setAllServiceData([])
                },
              })
            },
          })
        })
      },
    })
  }
  // handleOk //

  // CLOSE MODAL //
  const closeModal = () => {
    setIsOpen(false)
    addBookingForm.resetFields()
  }
  // CLOSE MODAL //

  // handleCheckboxOnchange //
  const handleCheckboxOnchange = (values: any) => {
    let updatedServicePaymentData = [...servicePaymentData]

    const matchingIndex = updatedServicePaymentData.findIndex(
      (item) => item.serviceId === values.id
    )

    if (matchingIndex !== -1) {
      updatedServicePaymentData.splice(matchingIndex, 1)
    } else {
      updatedServicePaymentData.push({serviceId: values.id})
    }

    setServicePaymentData(updatedServicePaymentData)
  }
  // handleCheckboxOnchange //

  // COLUMNS :: serviceColumns //
  const serviceColumns: any = [
    {
      title: 'Service',
      dataIndex: 'service',
      sorter: (a: any, b: any) => {
        if (a.guest > b.guest) {
          return 1
        }
        if (b.guest > a.guest) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Price',
      dataIndex: 'unitPrice',
      sorter: (a: any, b: any) => {
        if (a.room > b.room) {
          return 1
        }
        if (b.room > a.room) {
          return -1
        }
        return 0
      },
    },
    // {
    //   title: 'Action',
    //   fixed: 'right',
    //   render: (_: any, record: any) => (
    //     <Space size='middle'>
    //       <Checkbox onChange={() => handleCheckboxOnchange(record)} />
    //     </Space>
    //   ),
    // },
  ]
  // COLUMNS :: serviceColumns //

  function extendBookEnd(record: any) {
    console.log(record)
    selectedExtendBookEnd = dayjs(record?.formattedBookstart)
    selectedExtendBookEndHour = dayjs(record?.formattedBookend).format('HH:mm:ss')

    extendBookEndForm.setFieldsValue({
      Id: record?.id,
      roomId: record?.roomId,
      bookEnd: dayjs(record?.formattedBookend),
      bookStart: dayjs(record?.formattedBookstart),
      bookEndHidden: dayjs(record?.formattedBookend),
    })
    form.setFieldsValue({
      bookingId: record?.id,
      bookEnd: dayjs(record?.formattedBookend),
      hiddenprice: record?.price,
    })

    setopenExtendModal(true)
  }

  // COLUMN :: columns //
  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'guest',
      sorter: (a: any, b: any) => {
        if (a.guest > b.guest) {
          return 1
        }
        if (b.guest > a.guest) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Room',
      dataIndex: 'room',
      sorter: (a: any, b: any) => {
        if (a.room > b.room) {
          return 1
        }
        if (b.room > a.room) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Start',
      dataIndex: 'bookStart',
      sorter: (a: any, b: any) => {
        if (a.bookStart > b.bookStart) {
          return 1
        }
        if (b.bookStart > a.bookStart) {
          return -1
        }
        return 0
      },
    },

    {
      title: 'End',
      dataIndex: 'bookEnd',
      sorter: (a: any, b: any) => {
        if (a.bookEnd > b.bookEnd) {
          return 1
        }
        if (b.bookEnd > a.bookEnd) {
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
          <a href='#' className='btn btn-light-success btn-sm' onClick={() => addService(record)}>
            Services
          </a>
          {/* <a
            href='#'
            className='btn btn-light-dark btn-sm'
            onClick={() => displayTransferModal(record)}
          >
            Transfer
          </a> */}
          <Link
            to={`/Billing/${record.guestId}`}
            state={record}
            className='btn btn-light-primary btn-sm'
            onClick={() => navigate(`/Billing/${record.guestId}`, {replace: true})}
          >
            Check Out
          </Link>
          {/* <a href='#' className='btn btn-light btn-sm' onClick={() => extendBookEnd(record)}>
            Reschedule
          </a> */}
        </Space>
      ),
    },
  ]
  // COLUMN :: columns //

  // COLUMN :: reservationColumn //
  const reservationColumn: any = [
    {
      title: 'Name',
      dataIndex: 'guest',
      sorter: (a: any, b: any) => {
        if (a.guest > b.guest) {
          return 1
        }
        if (b.guest > a.guest) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Room',
      dataIndex: 'room',
      sorter: (a: any, b: any) => {
        if (a.room > b.room) {
          return 1
        }
        if (b.room > a.room) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Start',
      dataIndex: 'bookStart',
      sorter: (a: any, b: any) => {
        if (a.bookStart > b.bookStart) {
          return 1
        }
        if (b.bookStart > a.bookStart) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a
            href='#'
            className='btn btn-light-primary btn-sm'
            onClick={() =>
              checkGuestIn({
                id: record.id,
                CheckInOutTime: new Date(),
              })
            }
          >
            Check In
          </a>
        </Space>
      ),
    },
  ]
  // COLUMN :: reservationColumn //

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

  const checkGuestIn = (guestData: any) => {
    console.log('guestData: ', guestData)

    Modal.confirm({
      okText: 'Confirm',
      okType: 'primary',
      title: 'Kindly confirm check-In!',
      onOk: () => {
        checkGuestInQuery(guestData, {
          onSuccess: () => {
            message.success('Guest successfully ckecked in!')
            queryClient.invalidateQueries('Bookings')
            queryClient.invalidateQueries('Guests')
            queryClient.invalidateQueries('rooms')
          },
        })
      },
    })
  }

  const addService = (record: any) => {
    setopenAddServiceModal(true)
    setBookingId(record.id)
    setRoomId(record.roomId)
    setGuestId(record.guestId)
  }

  // USEEFFECT //
  useEffect(() => {
    loadData()
    setNewSearchedData(newFilteredData)
  }, [])

  useEffect(() => {
    setNewSearchedData(newFilteredData)
  }, [newFilteredData])
  // USEEFFECT //

  // VAR //
  var out_data: any = {}
  // VAR //

  gridData.forEach(function (row: any) {
    if (out_data[row.departmentId]) {
      out_data[row.departmentId].push(row)
    } else {
      out_data[row.departmentId] = [row]
    }
  })

  const cancelNoteModal = () => {
    setopenAddServiceModal(false)
    serviceForm.resetFields()
    setAllServiceData([])
    setTotalPrice(0)
  }

  const handleInputChange = (e: any) => {
    globalSearch(e.target.value)
    if (e.target.value === '') {
      loadData()
    }
  }

  const handleChangeForService = (e: any) => {
    let data = servicesDetails?.data.filter((item: any) => {
      return item.id == parseInt(e)
    })

    serviceForm.setFieldsValue({price: data[0].price})
    setpriceValue(data[0].price)
    setTotalPrice(data[0].price)
    const service = servicesOptions.filter((item: any) => {
      return item.value === e
    })

    setServiceData({...serviceData, service: service[0].label})
  }
  const onChangeForPrice = (e: any) => {
    if (e.target.value < 1) {
      serviceForm.setFieldsValue({price: ''})
    }

    setTotalPrice(e.target.value)
  }
  const onChangeForQuantity = (e: any) => {
    if (e.target.value <= 1) {
      serviceForm.setFieldsValue({quantity: 1})
    }

    setQuantityValue(e.target.value)
  }
  let arr: any = []
  const newService = (values: any) => {
    serviceData.totalPrice = 0
    serviceData.isPaid = 0
    serviceData.bookingId = bookingId
    serviceData.unitPrice = totalprice * quantityValue
    serviceData.roomId = guestroomId
    serviceData.guestId = guestId

    setAllServiceData((prevAllServicesArr: any) => [...prevAllServicesArr, serviceData])

    arr.push(serviceData)
    setpriceValue(false)
    setTotalPrice(0)

    serviceForm.resetFields()
  }

  const submitTransfer = (value: any) => {
    const {
      roomId,
      bookEnd,
      prv_roomId,
      customerId,
      id,
      customerReceiptNumber,
      companyId,
      price,
    } = formData

    runNightAudit(formData.customerId, {
      onSuccess: () => {
        submitRoomTransfer(formData, {
          onSuccess: () => {
            var data = {
              userId: currentUser?.id,
              description: 'Made a room transfer',
            }

            addAuditTrail(data, {
              onSuccess: () => {
                message.success('Transfer successful')

                setCheckUnAvailability(false)
                setopenTransferModal(false)

                queryClient.invalidateQueries('Guests')
                queryClient.invalidateQueries('rooms')
                queryClient.invalidateQueries('Bookings')
                queryClient.invalidateQueries('fetchServicesDetails')

                transferForm.resetFields()
              },
            })
          },

          onError(error, variables, context) {
            message.destroy('Room not available')
          },
        })
      },
    })
  }

  const newTransfer = (value: any) => {
    formData.roomId = value.roomId
    formData.bookEnd = value.bookEnd?.toISOString()

    checkIfAvailability(value, {
      onSuccess: () => {
        message.success('Room available')
        setCheckUnAvailability(false)
      },
      onError(error, variables, context) {
        message.destroy('Room not available')
      },
    })
  }

  const addCheckIn = () => {
    setIsOpen(true)
    addBookingForm.resetFields()
  }
  const globalSearch = (searchedValue: any) => {
    // @ts-ignore
    filteredData = newFilteredData.filter((Filteredvalue) => {
      return (
        Filteredvalue.guest?.toLowerCase().includes(searchedValue?.toLowerCase()) ||
        Filteredvalue.room?.toLowerCase().includes(searchedValue?.toLowerCase())
      )
    })

    setNewSearchedData(filteredData)
  }
  function cancelExtendDateModal() {
    setopenExtendModal(false)
    form.resetFields()
    extendBookEndForm.resetFields()
  }
  const handleShortTimeChange = (e: any) => {
    try {
      const data = getAllShortTimeData?.data.filter((item: any) => {
        return item.hours === e
      })

      if (data && data.length > 0) {
        form.setFieldsValue({
          name: data[0]?.name,
          price: e === '16:00' ? 0.0 : form.getFieldValue('hiddenprice') * 0.5,
          ischarged: data[0]?.isCharged,
        })
      }
    } catch (error) {}
    // console.log('data', data)
  }
  const submitShortTime = (values: any) => {
    const data = {
      bookingId: values?.bookingId,
      bookEnd: values?.bookEnd,
      Hours: values?.hours,
      price:values?.price
    }
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: `Are you sure, you want to extend booking to ${values?.hours} PM?`,
      onOk: () => {
        extendShortime(data, {
          onSuccess: () => {
            // console.log('VALUES::::',values)
            message.success('Booking Extended successfully done!')
            queryClient.invalidateQueries('Bookings')
            queryClient.invalidateQueries('Guests')
            queryClient.invalidateQueries('rooms')
            form.resetFields()
            setopenExtendModal(false)
          },
        })
      },
    })
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
          <div className='d-flex justify-content-between'>
          <Space style={{ marginBottom: 16 }}>
              {/* <Input
                placeholder='Search'
                type='text'
                onChange={(e:any) => globalSearch(e.target.value)}
              /> */}
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

          {/* TABLE */}
          <Table
            columns={columns}
            dataSource={newSearchedData}
            loading={BookingsLoad}
            className='table-responsive'
          />
          {/* TABLE */}

          {/* MODAL ::: New checkin*/}
          <Modal
            open={isOpen}
            onCancel={closeModal}
            footer={null}
            title='New checkin'
            width={'50%'}
          >
            <Table
              columns={reservationColumn}
              dataSource={newReservationData}
              loading={BookingsLoad}
            />
          </Modal>
          {/* MODAL ::: New checkin*/}

          {/* MODAL ::: Add Service */}
          <Modal
            open={openAddServiceModal}
            okText='Confirm'
            title='Add Service'
            closable={true}
            onCancel={cancelNoteModal}
            onOk={handleOk}
          >
            <CheckInAddService
              serviceForm={serviceForm}
              newService={newService}
              totalprice={totalprice}
              handleChangeForService={handleChangeForService}
              servicesOptions={servicesOptions}
              priceValue={priceValue}
              onChangeForPrice={onChangeForPrice}
              onChangeForQuantity={onChangeForQuantity}
              serviceColumns={serviceColumns}
              allServiceData={allServiceData}
            />
          </Modal>
          {/* MODAL ::: Add Service */}

          {/* MODAL ::: Extend Booking Date */}
          <Modal
            open={openExtendModal}
            okText='Save'
            title='Reschedule CheckOut'
            closable={true}
            onCancel={cancelExtendDateModal}
            onOk={() => (extendBookEndForm.submit())}
          >
            {/* <ul className='nav nav-tabs nav-line-tabs mb-5 fs-6'>
              <li className='nav-item' onClick={() => setActiveTab(1)}>
                <a
                  className={'nav-link ' + (activeLink === 1 ? 'active' : '')}
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_1'
                >
                  Late Checkout
                </a>
              </li>
              <li className='nav-item' onClick={() => setActiveTab(2)}>
                <a
                  className={'nav-link ' + (activeLink === 2 ? 'active' : '')}
                  data-bs-toggle='tab'
                  href='#kt_tab_pane_2'
                >
                  Day(s) Extension
                </a>
              </li>
            </ul> */}
            <div className='tab-content' id='myTabContent'>
              {/* <div
                className={'tab-pane fade ' + (activeLink === 1 ? 'active show' : '')}
                id='kt_tab_pane_1'
                role='tabpanel'
              >
                <Form
                  className='d-flex flex-column justify-content-start '
                  form={form}
                  onFinish={submitShortTime}
                >
                  <div className='row'>
                    <Form.Item name='bookEnd' label='Book End' hidden>
                      <DatePicker className='form-control form-control-solid' showTime />
                    </Form.Item>
                  
                    <Form.Item
                      name='bookingId'
                      label='Booking Id'
                      style={{width: '100%'}}
                      labelCol={{span: 5}}
                      hidden
                    >
                      <Input
                        type='text'
                        className='form-control form-control-solid'
                        style={{width: '100%'}}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      name='hours'
                      label='Time'
                      style={{width: '100%'}}
                      labelCol={{span: 5}}
                    >
                      <Select style={{width: '100%'}} onChange={(e:any) => handleShortTimeChange(e)}>
                        {getAllShortTimeData?.data.map((item: any) => (
                          <Option value={item.hours}>{item.hours}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name='name'
                      label='Name'
                      style={{width: '100%'}}
                      labelCol={{span: 5}}
                    >
                      <Input
                        type='text'
                        className='form-control form-control-solid'
                        style={{width: '100%'}}
                        disabled
                      />
                    </Form.Item>
                  </div>
                  <div className='row'>
                    <Form.Item
                      name='hiddenprice'
                      label='Price'
                      style={{width: '100%'}}
                      labelCol={{span: 5}}
                      hidden
                    >
                      <Input
                        type='number'
                        className='form-control form-control-solid'
                        style={{width: '100%'}}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      name='price'
                      label='Price'
                      style={{width: '100%'}}
                      labelCol={{span: 5}}
                      
                    >
                      <Input
                        type='number'
                        className='form-control form-control-solid'
                        style={{width: '100%'}}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      name='ischarged'
                      label='Is charged'
                      style={{width: '100%'}}
                      labelCol={{span: 5}}
                    >
                      <Input
                        type='text'
                        className='form-control form-control-solid'
                        style={{width: '100%'}}
                        disabled
                      />
                    </Form.Item>
                  </div>
                </Form>
              </div> */}

              <div
                // className={'tab-pane fade ' + (activeLink === 2 ? 'active show' : '')}
                id='kt_tab_pane_2'
                role='tabpanel'
              >
                <CheckInExtendBookingDate
                  extendBookEndForm={extendBookEndForm}
                  extendBookOnFinish={extendBookOnFinish}
                  bookingData={bookingData}
                />
              </div>
            </div>
          </Modal>

          <Modal
            open={openTransferModal}
            okText='Confirm'
            title='Select new Room'
            closable={true}
            onCancel={cancelTransferModal}
            footer={null}
          >
            <CheckInSelectNewRoom
              transferForm={transferForm}
              newTransfer={newTransfer}
              roomsdata={roomsdata}
              selectedItemBookEnd={selectedItemBookEnd}
              cancelTransferModal={cancelTransferModal}
              isUnAvailable={isUnAvailable}
              submitTransfer={submitTransfer}
            />
          </Modal>
          {/* MODAL ::: Select new Room */}

          <Modal
            open={openGenerateModal}
            okText='Pay'
            title='Bill'
            closable={true}
            onCancel={cancelBillModal}
            onOk={handlePayment}
          >
            <Space style={{marginBottom: 16, display: 'flex', justifyContent: 'center'}}>
              <Form className='d-flex' form={formCurrency}>
                <Form.Item name='To' style={{marginRight: '5px'}}>
                  <Input placeholder='USD' onChange={convertFromDollar} type='number' />
                </Form.Item>
                <Form.Item name='From'>
                  <Input placeholder='GHS' onChange={convertFromCedis} type='number' />
                </Form.Item>
              </Form>
            </Space>
            <Tabs
              defaultActiveKey='1'
              items={[
                {
                  label: 'Non-Paid Items',
                  key: '1',
                  children: (
                    <Table
                      columns={serviceColumns}
                      dataSource={serviceBillData}
                      className='table-responsive'
                    />
                  ),
                },
                {
                  label: 'Paid-Items',
                  key: '2',
                  children: (
                    <Table
                      columns={serviceColumns}
                      dataSource={paidServiceData}
                      className='table-responsive'
                    />
                  ),
                },
              ]}
            />

            <Divider style={{background: 'black'}} />
            <span className='fs-bold' style={{fontSize: 'bold'}}>
              Total Bill: {totalGuestBill}
            </span>
          </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export {CheckIn}
