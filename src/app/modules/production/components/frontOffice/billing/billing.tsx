import {
  Button,
  Form,
  Input,
  Select,
  Modal,
  Space,
  Table,
  message,
  Typography,
  Row,
  Col,
  Radio,
  Checkbox,
} from 'antd'
import dayjs, {Dayjs} from 'dayjs'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {BASE_URL} from '../../../urls'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {useQuery, useQueryClient, useMutation} from 'react-query'
import {
  GuestCheckoutApi,
  addCompanyBills,
  addCompanyPayment,
  addGuestBilling,
  fetchActivePaymentMethods,
  fetchBookings,
  fetchCompanies,
  fetchCurrencies,
  fetchGuestBilling,
  fetchGuests,
  fetchNationalities,
  fetchPaymentNotes,
  fetchRooms,
  fetchTaxes,
  getCompanyBills,
  makeGuestBillingTransfer,
  shortenBookingStayApi,
} from '../../../../../services/ApiCalls'
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns'
import {useAuth} from '../../../../auth'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import moment from 'moment'
import { FaMoneyCheckAlt, FaFileInvoiceDollar, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa'; // Import icons
import { MdCreditCard, MdExitToApp } from 'react-icons/md'; // Additional icons
const Billing = () => {
  const [guestBillData, setGuestBillData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [selectedCompanyId, setCompanyData] = useState<any>([])
  const [paymentMehtodIsCheck, setPaymentMehtodIsCheck] = useState(false)
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false)
  const [isCompaniesDropdownOpen, setIsCompaniesDropdownOpen] = useState(false)
  const [openPaymentModal, setopenPaymentModal] = useState(false)
  const [openReceiptModal, setopenReceiptModal] = useState(false)
  const [openDebitModal, setopenDebitModal] = useState(false)
  const [openCreditModal, setopenCreditModal] = useState(false)
  const [openTransferModal, setopenTransferModal] = useState(false)
  const [openTransferBillToCompanyModal, setopenTransferToCompanyBillModal] = useState(false)
  const [openCheckOutModal, setopenCheckOutModal] = useState(false)
  const [serviceType, setServiceType] = useState('ALL_CHARGES')
  const {mutate: guestBilling} = useMutation((values: any) => addGuestBilling(values))
  const {mutate: companyPayment} = useMutation((values: any) => addCompanyPayment(values))
  const {mutate: companyBillingData} = useMutation((values: any) => addCompanyBills(values))
  let customerBookingId: number
  let customerReceiptNumber: string
  const {mutate: guestBillingTransfer} = useMutation((values: any) =>
    makeGuestBillingTransfer(values)
  )
  const {data: currencydata, isLoading: currencyLoad} = useQuery('currency', fetchCurrencies)
  const {data: companyAllData, isLoading: companyLoading} = useQuery(
    'allcompaniesQuery',
    getCompanyBills
  )
  const guestTransferrableBillingData: {value: any; label: any}[] = [] // Initialize the array
  const {mutate: shortenBookingFetchData} = useMutation((values: any) =>
    shortenBookingStayApi(values)
  )
  const {data: paymentNotedata, isLoading: paymentNoteLoad} = useQuery(
    'paymentNote',
    fetchPaymentNotes
  )

  const {data: companiesdata, isLoading: companiesLoad} = useQuery('companies', fetchCompanies)
  const {data: activePaymentMethoddata, isLoading: activePaymentMethodLoad} = useQuery(
    'paymentMethod',
    fetchActivePaymentMethods
  )
  const {data: roomsdata, isLoading: roomsLoad} = useQuery('rooms', fetchRooms)
  const {data: guestdata, isLoading: guestLoad} = useQuery('guests', fetchGuests)
  const {data: taxdata, isLoading: taxLoad} = useQuery('tax', fetchTaxes)
  const {data: nationalityData, isLoading: nationalityLoad} = useQuery(
    'nationalities',
    fetchNationalities
  )
  const today = new Date().toISOString().substr(0, 10) // Get current date in YYYY-MM-DD format

  const {mutate: checkGuestOutQuery} = useMutation((values: any) => GuestCheckoutApi(values))
  const parms: any = useParams()
  const {
    data: billingData,
    isLoading: billingLoad,
    refetch: refetchBillingData,
  } = useQuery(['AllGuestBillings', parms['*']], () =>
    fetchGuestBilling(parms['*'], isCompaniesDropdownOpen, serviceType)
  )

  const {currentUser, logout} = useAuth()
  const [customerForm] = Form.useForm()
  const [paymentForm] = Form.useForm()
  const [debitForm] = Form.useForm()
  const [creditForm] = Form.useForm()
  const [billToCompanyForm] = Form.useForm()
  const queryClient = useQueryClient()

  const {Text} = Typography
  const parms2: any = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const {data: bookingData, isLoading: BookingsLoad} = useQuery('Bookings', fetchBookings)

  const [guest, setGuest] = useState<number>()

  // let userData : any = location?.state
  let userData: any = location?.state || {}

  var totalDebit = 0
  var totalCredit = 0
  var totalBalance = 0
  var taxedBalance = 0
  var booking: {id: number; price: number; bookEnd: Date; bookStart: Date}[]

  totalBalance = totalCredit - totalDebit
  var totalConvertedDebit = 0
  var totalConvertedCredit = 0
  var totalConvertedBalance
  var convertedTaxedBalance = 0
  var symbol
  var salesAmount: any
  var subTotal = 0
  var finalSubTotal = 0

  //LocalRate
  var localRate = 0

  currencydata?.data.map((cc: any) => {
    if (cc.symbol?.trim() === 'GHS') {
      localRate = cc.rate
    }
  })

  companiesdata?.data.map((a: any) => {
    if (a.id === parms['*']) {
    }
  })
  function checkOutMethod() {
    if (totalConvertedCredit - totalConvertedDebit < 0) {
      settleRemainingBalance()
    } else {
      showCheckOutModal()
    }
  }
  function paymentMethodChange(e: any) {
    if (e === 'CHEQUE GHS') {
      setPaymentMehtodIsCheck(true)
    } else {
      setPaymentMehtodIsCheck(false)
    }
  }
  function openTransferBillModal() {
    billToCompanyForm.setFieldValue(
      'companyId',
      guestdata?.data.find((item: any) => item.id === parseInt(parms['*']))?.companyId
    )
    setopenTransferToCompanyBillModal(true)
  }
  function cancelBillToTransferModal() {
    setopenTransferToCompanyBillModal(false)
    billToCompanyForm.resetFields()
  }
  function shortenStay() {
    const values = {
      Id: booking[0]?.id,
      BookStart: booking[0]?.bookStart,
      BookEnd: booking[0]?.bookEnd,
      price: booking[0]?.price,
    }

    Modal.confirm({
      okText: 'Save',
      okType: 'primary',
      title: 'Are you sure, you want to add this service?',
      onOk: () => {
        shortenBookingFetchData(values, {
          onSuccess: () => {
            message.info('Booking shortened successfully')
            queryClient.invalidateQueries('currency')
            queryClient.invalidateQueries('rooms')
            queryClient.invalidateQueries('guests')
            queryClient.invalidateQueries('tax')
            queryClient.invalidateQueries('AllGuestBillings')
            queryClient.invalidateQueries('paymentMethod')
          },
        })
      },
    })
  }

  var newBillingData = billingData?.data.filter((item:any)=>{
    return item.iscancelled !==1
  }).map((b: any, index: any) => {
    var newCredit
    var newDebit
    var rate
    var amount
    var room

    var date = new Date(b.timestamp)

    if (b.customerBookingId !== null) {
      booking = bookingData?.data.filter((item: any) => {
        return item.id === b.customerBookingId
      })
      if (booking && booking.length > 0) {
        customerBookingId = bookingData?.data.filter((item: any) => {
          return item.id === b.customerBookingId
        })[0]?.id
        customerReceiptNumber = bookingData?.data.filter((item: any) => {
          return item.id === b.customerBookingId
        })[0]?.customerReceiptNumber
      }
    }

    currencydata?.data.map((c: any) => {
      if (c.symbol?.trim() === b.currency?.trim()) {
        newCredit = (b.credit / c.rate).toFixed(2)
        newDebit = (b.debit / c.rate).toFixed(2)
        rate = c.rate.toFixed(2)
        totalDebit = totalDebit + parseFloat(newDebit)
        totalCredit = totalCredit + parseFloat(newCredit)
        totalBalance = totalDebit - totalCredit

        if (b.isPayment === false || b.isPayment === null) {
          taxedBalance =
            taxedBalance +
            (parseFloat((b.credit / c.rate).toFixed(2)) - parseFloat((b.debit / c.rate).toFixed(2)))
        }
      }
      totalConvertedCredit = parseFloat((parseFloat(totalCredit.toFixed(2)) * localRate).toFixed(2))
      totalConvertedDebit = parseFloat((parseFloat(totalDebit.toFixed(2)) * localRate).toFixed(2))
      totalConvertedBalance =
        parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2)) < 0
          ? `(${Intl.NumberFormat('en-US', {
              currency: 'USD', // Change to your desired currency code
            }).format(
              parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2)) * -1
            )})`
          : Intl.NumberFormat('en-US', {
              currency: 'USD', // Change to your desired currency code
            }).format(parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2)))
      convertedTaxedBalance = parseFloat(
        (parseFloat(taxedBalance.toFixed(2)) * localRate).toFixed(2)
      )
    })
    roomsdata?.data.map((r: any) => {
      if (b.roomId === r.id) {
        room = r.name
      }
    })

    if (b.debit === 0 || b.debit === null) {
      amount = b.credit
    } else {
      amount = b.debit
    }

    return {
      index: index + 1,
      customerId: b.customerId,
      roomId: b.roomId,
      room: room,
      price: booking && booking[0]?.price,
      bookingNumberOfDays:
        booking &&
        Math.round(
          (new Date(booking[0]?.bookEnd).getTime() - new Date(booking[0]?.bookStart).getTime()) /
            (1000 * 60 * 60 * 24)
        ),

      date: date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      description: b.description,
      currency: b.currency,
      rate: rate,
      debit: newDebit,
      credit: newCredit,
      amount: amount,
    }
  })

  let vat: any
  const VAT_Taxes = taxdata?.data.map((item: any, index: number) => {
    if (totalConvertedDebit < 0) {
      totalConvertedDebit = totalConvertedDebit * -1
    }

    if (item.isLevy === null || item.isLevy === false) {
      vat = (totalConvertedDebit * item.rate) / (100 + item.rate)

      return (
        <div key={index} style={{textAlign: 'right', marginRight: '65px'}}>
          <p>
            {item.name}: GHS{' '}
            {Intl.NumberFormat('en-US', {
              currency: 'USD', // Change to your desired currency code
            }).format(vat)}
          </p>
        </div>
      )
    }
  })
  const LEVY_Taxes = taxdata?.data.map((item: any, index: number) => {
    if (totalConvertedDebit < 0) {
      totalConvertedDebit = totalConvertedDebit * -1
    }
    // Check the condition for each item
    if (item.isLevy === true) {
      salesAmount = ((totalConvertedDebit - vat) / 107) * 100
      const levy = (salesAmount * item.rate) / 100
      subTotal = subTotal + levy
      finalSubTotal = salesAmount + subTotal
      return (
        <div key={index} style={{textAlign: 'right', marginRight: '65px'}}>
          <p>
            {item.name}: GHS{' '}
            {Intl.NumberFormat('en-US', {
              currency: 'USD', // Change to your desired currency code
            }).format(levy)}
          </p>
        </div>
      )
    }
  })

  var guestListData = guestdata?.data.map((e: any) => {
    return {
      id: e.id,
      name: `${e.firstname?.trim()} ${e.lastname?.trim()}`,
    }
  })

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
      title: 'Action',
      fixed: 'right',
      // width: 20,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a
            className='btn btn-light-primary btn-sm'
            onClick={() =>
              checkGuestOut({
                id: record.id,
                CheckInOutTime: new Date(),
              })
            }
          >
            Check Out
          </a>
        </Space>
      ),
    },
  ]

  const data = bookingData?.data.map((e: any) => {
    const guest = guestdata?.data.find((x: any) => {
      if (x.id === e.guestId) {
        return x
      }
    })
    const room = roomsdata?.data.find((x: any) => {
      if (x.id === e.roomId) {
        return x
      }
    })

    var checkinTimeData = new Date(e?.checkInTime)

    var bookStartTime = new Date(e?.bookStart)
    var bookEndTime = new Date(e?.bookEnd)

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

  const newReservationData = data?.filter((e: any) => {
    return e.checkOutTime == null && e.checkInTime != null && e.guestId == parms['*']
  })

  const newBillTransfer = (value: any) => {
    value.customerId = parms['*']

    guestBillingTransfer(value, {
      onSuccess: () => {
        message.success('Transfer made successfully!')
        setopenTransferModal(false)
        paymentForm.resetFields()
        queryClient.invalidateQueries('AllGuestBillings')
        queryClient.invalidateQueries('paymentMethod')
      },
      onError(error, variables, context) {
        message.destroy('Error occurred while submitting payment')
      },
    })
  }
  function billsToTransfer(values: any) {
    var totalBill = 0
    values?.bills.map((e: any) => {
      const currencySymbol = 'GHS'
      const ghsRate = currencydata?.data.find(
        (item: {symbol: string}) => item?.symbol.trim() === currencySymbol
      )?.rate

      const debitInUSD = billingData?.data.find((item: {id: any}) => item.id === e)?.debit
      const currencyInUSD = billingData?.data
        .find((item: {id: any}) => item.id === e)
        ?.currency.trim()

      totalBill = totalBill + (currencyInUSD === 'USD' ? debitInUSD : debitInUSD / ghsRate)
    })
    values.customerId = parms['*']
    values.isPayment = true
    values.CreatedBy = currentUser?.id
    values.receiptNumber = customerReceiptNumber
    values.timestamp = new Date()
    values.credit = totalBill
    values.description = 'Transferred'
    values.companyId = values.companyId
    values.paymentMethod = 'On Account'
    values.customerBookingId = customerBookingId
    values.currency = 'USD'

    companyBillingData(values, {
      onSuccess: () => {
        message.success('Bills transferred successfully!')
        queryClient.invalidateQueries('allcompaniesQuery')
        setopenTransferToCompanyBillModal(false)
        billToCompanyForm.resetFields()
        queryClient.invalidateQueries('AllGuestBillings')
        queryClient.invalidateQueries('paymentMethod')
      },
      onError(error, variables, context) {
        message.destroy('Error occurred while submitting payment')
      },
    })
  }
  const newPayment = (value: any) => {
    if (isCompaniesDropdownOpen) {
      value.companyId = selectedCompanyId
      value.isPayment = true
      value.CreatedBy = currentUser?.id

      value.timestamp = new Date()

      companyPayment(value, {
        onSuccess: () => {
          message.success('Transaction made successfully!')
          setopenPaymentModal(false)
          setPaymentMehtodIsCheck(false)
          paymentForm.resetFields()
          queryClient.invalidateQueries('AllGuestBillings')
          queryClient.invalidateQueries('paymentMethod')
        },
        onError(error, variables, context) {
          message.destroy('Error occurred while submitting payment')
        },
      })
    } else {
      value.customerId = parms['*']
      value.isPayment = true
      value.CreatedBy = currentUser?.id
      value.roomId = newBillingData[0]?.roomId
      value.receiptNumber = customerReceiptNumber
      value.timestamp = new Date()

      guestBilling(value, {
        onSuccess: () => {
          message.success('Transaction made successfully!')
          setopenPaymentModal(false)
          setPaymentMehtodIsCheck(false)
          paymentForm.resetFields()
          queryClient.invalidateQueries('AllGuestBillings')
          queryClient.invalidateQueries('paymentMethod')
        },
        onError(error, variables, context) {
          message.destroy('Error occurred while submitting payment')
        },
      })
    }
  }
  const newDebit = (value: any) => {
    if (isCompaniesDropdownOpen) {
      value.companyId = selectedCompanyId

      value.CreatedBy = currentUser?.id

      value.CreatedBy = currentUser?.id

      companyPayment(value, {
        onSuccess: () => {
          message.success('Transaction made successfully!')
          setopenDebitModal(false)
          debitForm.resetFields()
          queryClient.invalidateQueries('AllGuestBillings')
        },
        onError(error, variables, context) {
          message.destroy('Error occurred while submitting payment')
        },
      })
    } else {
      value.customerId = parms['*']
      value.CreatedBy = currentUser?.id
      value.customerBookingId = customerBookingId
      value.receiptNumber = customerReceiptNumber
      guestBilling(value, {
        onSuccess: () => {
          message.success('Transaction made successfully!')
          setopenDebitModal(false)
          debitForm.resetFields()
          queryClient.invalidateQueries('AllGuestBillings')
        },
        onError(error, variables, context) {
          message.destroy('Error occurred while submitting payment')
        },
      })
    }
  }
  const newCredit = (value: any) => {
    if (isCompaniesDropdownOpen) {
      value.companyId = selectedCompanyId

      value.CreatedBy = currentUser?.id

      companyPayment(value, {
        onSuccess: () => {
          message.success('Transaction made successfully!')
          setopenCreditModal(false)
          creditForm.resetFields()
          queryClient.invalidateQueries('AllGuestBillings')
        },
        onError(error, variables, context) {
          message.destroy('Error occurred while submitting payment')
        },
      })
    } else {
      value.customerId = parms['*']
      value.CreatedBy = currentUser?.id
      value.receiptNumber = customerReceiptNumber
      guestBilling(value, {
        onSuccess: () => {
          message.success('Transaction made successfully!')
          setopenCreditModal(false)
          creditForm.resetFields()
          queryClient.invalidateQueries('AllGuestBillings')
        },
        onError(error, variables, context) {
          message.destroy('Error occurred while submitting payment')
        },
      })
    }
  }

  const custForm = (value: any) => {
    // console.log('data', value['value'])
    localStorage.setItem('receiptGuest', value['value'])
    setCompanyData(value['value'])
    queryClient.invalidateQueries('AllGuestBillings')
    navigate(`/Billing/${value['value']}`, {replace: true})
  }
  useEffect(() => {
    refetchBillingData()

    billingData?.data.map((b: any, index: any) => {
      const data = companyAllData?.data.filter((item: any) => {
        return item.billingId === b.id
      })
      if (data && data.length === 0) {
        if (b.debit !== null) {
          guestTransferrableBillingData.push({value: b.id, label: b.description})
        }
      }
      return b
    })
    setGuestBillData(guestTransferrableBillingData)
  }, [newBillingData, billingData])

  const columns: any = [
    {
      title: '#',
      dataIndex: 'index',
      sorter: (a: any, b: any) => {
        if (a.index > b.index) {
          return 1
        }
        if (b.index > a.index) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a: any, b: any) => {
        if (a.date > b.date) {
          return 1
        }
        if (b.date > a.date) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Room',
      dataIndex: 'room',
      sorter: (a: any, b: any) => {
        if (a.roomId > b.roomId) {
          return 1
        }
        if (b.roomId > a.roomId) {
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
      title: 'FX Currency',
      dataIndex: 'currency',
      sorter: (a: any, b: any) => {
        if (a.currency > b.currency) {
          return 1
        }
        if (b.currency > a.currency) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Room Rate',
      dataIndex: 'price', // Room Rate
      sorter: (a: any, b: any) => {
        if (a.credit > b.credit) {
          return 1
        }
        if (b.credit > a.credit) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Number of day(s)',
      dataIndex: 'bookingNumberOfDays', // Value Nbre of day
      sorter: (a: any, b: any) => {
        if (a.credit > b.credit) {
          return 1
        }
        if (b.credit > a.credit) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a: any, b: any) => {
        if (a.credit > b.credit) {
          return 1
        }
        if (b.credit > a.credit) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      sorter: (a: any, b: any) => {
        if (a.debit > b.debit) {
          return 1
        }
        if (b.debit > a.debit) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      sorter: (a: any, b: any) => {
        if (a.credit > b.credit) {
          return 1
        }
        if (b.credit > a.credit) {
          return -1
        }
        return 0
      },
    },
  ]
  const companiesColumns = [
    {
      title: '#',
      dataIndex: 'index',
      sorter: (a: any, b: any) => {
        if (a.index > b.index) {
          return 1
        }
        if (b.index > a.index) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a: any, b: any) => {
        if (a.date > b.date) {
          return 1
        }
        if (b.date > a.date) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Guest',

      sorter: (a: any, b: any) => {
        if (a.roomId > b.roomId) {
          return 1
        }
        if (b.roomId > a.roomId) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Room',
      dataIndex: 'room',
      sorter: (a: any, b: any) => {
        if (a.roomId > b.roomId) {
          return 1
        }
        if (b.roomId > a.roomId) {
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
      title: 'FX Currency',
      dataIndex: 'currency',
      sorter: (a: any, b: any) => {
        if (a.currency > b.currency) {
          return 1
        }
        if (b.currency > a.currency) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Room Rate',
      dataIndex: 'price', // Room Rate
      sorter: (a: any, b: any) => {
        if (a.credit > b.credit) {
          return 1
        }
        if (b.credit > a.credit) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Number of day(s)',
      dataIndex: 'bookingNumberOfDays', // Value Nbre of day
      sorter: (a: any, b: any) => {
        if (a.credit > b.credit) {
          return 1
        }
        if (b.credit > a.credit) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a: any, b: any) => {
        if (a.credit > b.credit) {
          return 1
        }
        if (b.credit > a.credit) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      sorter: (a: any, b: any) => {
        if (a.debit > b.debit) {
          return 1
        }
        if (b.debit > a.debit) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      sorter: (a: any, b: any) => {
        if (a.credit > b.credit) {
          return 1
        }
        if (b.credit > a.credit) {
          return -1
        }
        return 0
      },
    },
  ]

  const settleRemainingBalance = () => {
    message.warning('Please settle remaining amount before proceeding')
  }
  const checkGuestOut = (value: any) => {
    var guestData = {
      id: parms2['*'],
      isCorporate: isCompaniesDropdownOpen,
    }

    checkGuestOutQuery(guestData, {
      onSuccess: () => {
        message.success('Guest successfully ckecked out!')
        // window.print()
        queryClient.invalidateQueries('currency')
        queryClient.invalidateQueries('rooms')
        queryClient.invalidateQueries('guests')
        queryClient.invalidateQueries('tax')

        setopenCheckOutModal(false)
      },
    })
    //   },
    // })
  }

  const goBack = (value: any) => {
    navigate(-1)
  }

  const cancelBillModal = () => {
    setopenReceiptModal(false)
    setopenPaymentModal(false)
    setPaymentMehtodIsCheck(false)
    setopenDebitModal(false)
    setopenCreditModal(false)
    setopenTransferModal(false)
    setopenCheckOutModal(false)
  }
  const showReceipt = () => {
    setopenReceiptModal(true)
  }
  const addPayment = () => {
    setopenPaymentModal(true)
  }
  const addDebit = () => {
    setopenDebitModal(true)
  }
  const addCredit = () => {
    setopenCreditModal(true)
  }
  const billTransfer = () => {
    setopenTransferModal(true)
  }
  const showCheckOutModal = () => {
    setopenCheckOutModal(true)
  }

  const handleLedgerTypeChange = (e: any) => {
    const selectedValue = e.target.value
    if (selectedValue === 'GUEST') {
      setIsGuestDropdownOpen(true)
      setIsCompaniesDropdownOpen(false)
    } else {
      setIsCompaniesDropdownOpen(true)
      setIsGuestDropdownOpen(false)
    }
  }
  const handleGuestBillingChange = (e: any) => {
    console.log('e', e)
  }
  const handleServiceTypeChange = (e: any) => {
    const selectedValue = e

    setServiceType(selectedValue)
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
        <div className='e-field'>
          {/* <div>
            <Form form={customerForm}>
              <Form.Item
                name={'ledgerType'}
                // label='Customer'
                rules={[{required: true, message: 'Please select a ledger type'}]}
                hasFeedback
                style={{width: '10%'}}
                labelCol={{span: 2}}
              >
                <select
                  // {...register('account')}
                  className='form-select form-select-solid'
                  aria-label='Select example'
                  onChange={(e) => handleLedgerTypeChange(e)}
                >
                  <Select.Option>select </Select.Option>
                  <option value='GUEST'>GUEST</option>
                  <option value='CORPORATE'>CORPORATE</option>
                </select>
              </Form.Item>
            </Form>
          </div> */}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
                {Object.keys(userData).length > 0 ? (
                  <p style={{fontWeight: 'bold'}}>{userData?.guest}</p>
                ) : (
                  <Form form={customerForm}>
                    <Form.Item
                      name={'guestId'}
                      // label='Customer'
                      rules={[{required: true, message: 'Please select a guest'}]}
                      hasFeedback
                      style={{width: '250%'}}
                      labelCol={{span: 5}}
                    >
                      <DropDownListComponent
                        id='guest'
                        placeholder='Guest'
                        data-name='guest'
                        className='e-field'
                        dataSource={guestListData}
                        allowFiltering={true}
                        fields={{text: 'name', value: 'id'}}
                        onChange={custForm}
                      />
                    </Form.Item>
                  </Form>
                )}
              </div>
            <div>
            <Space style={{ marginBottom: 16 }}>
  <button
    type="button"
    className="btn me-3"
    onClick={addPayment}
    style={{
      backgroundColor: '#B8860B',
      borderColor: '#B8860B',
      color: 'white',
      borderRadius: '8px',
      padding: '10px 20px',
      fontWeight: 'bold',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease'
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#A7711A')}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#B8860B')}
  >
    <FaMoneyCheckAlt style={{ marginRight: '8px' }} /> {/* Payment Icon */}
    Payment
  </button>
</Space>

<Space style={{ marginBottom: 16 }}>
  <Link to={`#`}>
    <button
      type="button"
      className="btn me-3"
      onClick={addDebit}
      style={{
        backgroundColor: '#B8860B',
        borderColor: '#B8860B',
        color: 'white',
        borderRadius: '8px',
        padding: '10px 20px',
        fontWeight: 'bold',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#A7711A')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#B8860B')}
    >
      <MdCreditCard style={{ marginRight: '8px' }} /> {/* Debit Note Icon */}
      Debit Note
    </button>
  </Link>
</Space>

<Space style={{ marginBottom: 16 }}>
  <Link to={`#`}>
    <button
      type="button"
      className="btn me-3"
      onClick={addCredit}
      style={{
        backgroundColor: '#B8860B',
        borderColor: '#B8860B',
        color: 'white',
        borderRadius: '8px',
        padding: '10px 20px',
        fontWeight: 'bold',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#A7711A')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#B8860B')}
    >
      <FaMoneyBillWave style={{ marginRight: '8px' }} /> {/* Credit Note Icon */}
      Credit Note
    </button>
  </Link>
</Space>

<Space style={{ marginBottom: 16}}>
  <Link to={`#`}>
    <button
      type="button"
      className="btn me-3"
      onClick={checkOutMethod}
      style={{
        backgroundColor: '#4E3B2A',
        borderColor: '#4E3B2A',
        color: 'white',
        borderRadius: '8px',
        padding: '10px 20px',
        fontWeight: 'bold',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#D94C2A')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4E3B2A')}
    >
      <MdExitToApp style={{ marginRight: '8px' }} /> {/* Check Out Icon */}
      Check Out
    </button>
  </Link>
</Space>


            </div>
          </div>
          <div className='d-flex justify-content-between'></div>
          {isCompaniesDropdownOpen === true ? (
            <>
              <Table
                columns={companiesColumns}
                dataSource={newBillingData}
                loading={billingLoad}
                className='table-responsive'
              />
            </>
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={newBillingData}
                loading={billingLoad}
                pagination={false}
                className='table-responsive'
              />
            </>
          )}
        </div>
        <div style={{width: '100%'}}>
          {/* //Row 1 */}
          <Row gutter={24}>
            <Col span={3} style={{background: 'none'}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={3} style={{background: 'none'}}>
              {/* <Text>{totalCredit}</Text> */}
            </Col>
            <Col span={6} style={{background: 'none'}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={6} style={{background: 'none'}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={2} style={{background: 'none', textAlign: 'end'}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text>
                USD{' '}
                {Intl.NumberFormat('en-US', {
                  currency: 'USD', // Change to your desired currency code
                }).format(totalDebit)}
              </Text>
            </Col>
            <Col span={3} style={{background: 'none', textAlign: 'end'}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text>
                USD{' '}
                {Intl.NumberFormat('en-US', {
                  currency: 'USD', // Change to your desired currency code
                }).format(totalCredit)}
              </Text>
            </Col>
            <Col span={1} style={{background: 'none', textAlign: 'end'}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
          </Row>
          {/* //Row 2 */}
          <Row gutter={24}>
            <Col span={2} style={{background: 'none'}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={3} style={{background: 'none'}}>
              {/* <Text>{totalCredit}</Text> */}
            </Col>
            <Col span={7} style={{background: 'none'}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={4} style={{background: 'none'}}>
              {/* <Text>{totalCredit}</Text> */}
            </Col>
            <Col span={4} style={{background: 'none', textAlign: 'end'}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text>
                GHS{' '}
                {Intl.NumberFormat('en-US', {
                  currency: 'USD', // Change to your desired currency code
                }).format(totalConvertedDebit)}
              </Text>
            </Col>
            <Col span={3} style={{background: 'none', textAlign: 'end'}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text>
                GHS{' '}
                {Intl.NumberFormat('en-US', {
                  currency: 'USD', // Change to your desired currency code
                }).format(totalConvertedCredit)}
              </Text>
            </Col>
            <Col span={1} style={{background: 'none', textAlign: 'end'}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
          </Row>

          {/* //Row 3 */}
          <Row gutter={24}>
            <Col span={2} style={{background: 'none'}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={3} style={{background: 'none'}}>
              {/* <Text>{totalCredit}</Text> */}
            </Col>
            <Col span={7} style={{background: 'none'}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={4} style={{background: 'none'}}>
              {/* <Text>{totalCredit}</Text> */}
            </Col>
            <Col span={4} style={{background: 'none', textAlign: 'end'}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text style={{fontWeight: 'bold'}}>Balance</Text>
            </Col>
            <Col span={3} style={{background: 'none', textAlign: 'end'}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text style={{fontWeight: 'bold'}}>GHS {totalConvertedBalance}</Text>
            </Col>
            <Col span={1} style={{background: 'none', textAlign: 'end'}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
          </Row>
          {isCompaniesDropdownOpen === true ? null : (
            <>
              {' '}
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <Text style={{textAlign: 'right', marginRight: '65px', marginTop: '10px'}}>
                  SALES AMOUNT: GHS{' '}
                  {Intl.NumberFormat('en-US', {
                    currency: 'USD', // Change to your desired currency code
                  }).format(salesAmount)}
                </Text>
                <Text>{LEVY_Taxes}</Text>
                <Text style={{textAlign: 'right', marginRight: '65px'}}>
                  SUB-TOTAL: GHS{' '}
                  {Intl.NumberFormat('en-US', {
                    currency: 'USD', // Change to your desired currency code
                  }).format(salesAmount + subTotal)}
                </Text>
                <Text>{VAT_Taxes}</Text>
                <Text style={{textAlign: 'right', marginRight: '65px', fontWeight: 'bold'}}>
                  GRAND TOTAL: GHS {Intl.NumberFormat('en-US', {
                    currency: 'USD', // Change to your desired currency code
                  }).format(totalConvertedDebit)}
                  {/* {Intl.NumberFormat('en-US', {
              currency: 'USD', // Change to your desired currency code
            }).format(totalConvertedDebit)} */}
                </Text>
                {/* {isCompaniesDropdownOpen === true ? (
            <Text style={{textAlign: 'right', marginRight: '65px', fontWeight: 'bold'}}>
              WITHHOLDING TAX: GHS{' '}
              {Intl.NumberFormat('en-US', {
                currency: 'USD', // Change to your desired currency code
              }).format(totalConvertedDebit - (totalConvertedDebit * 7) / 100)}
            </Text>
          ) : null} */}
              </div>
            </>
          )}
        </div>
          
        {/* Receipt */}

        {/*CheckOut Modal */}
        <Modal
          open={openCheckOutModal}
          onCancel={cancelBillModal}
          footer={null}
          title='Confirm CheckOut'
          width={'50%'}
        >
          <Table
            columns={reservationColumn}
            dataSource={newReservationData}
            loading={BookingsLoad}
          />
        </Modal>

        {/* Transfer */}
        <Modal
          open={openTransferModal}
          okText='Confirm'
          title='Transfer'
          closable={true}
          onCancel={cancelBillModal}
          footer={null}
        >
          <Form form={paymentForm} onFinish={newBillTransfer} layout='vertical'>
            <Form.Item
              name={'description'}
              label='Description'
              rules={[{required: true, message: 'Please enter description'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='text'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'amount'}
              label='Payment'
              rules={[{required: true, message: 'Please enter amount'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='number'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'currency'}
              label='Currency'
              rules={[{required: true, message: 'Please select a currency'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Select
                id='currency'
                // name='currency'
                className='e-field'
                style={{width: '100%'}}
                placeholder='Currency'
              >
                {currencydata?.data.map((item: any) => (
                  <Select.Option key={item.symbol} value={item.symbol}>
                    {item.symbol}
                  </Select.Option>
                ))}
              </Select>
              {/* <DropDownListComponent
                  id='currency'
                  placeholder='Currency'
                  data-name='currency'
                  className='e-field'
                  dataSource={currencydata?.data}
                  fields={{text: 'symbol', value: 'symbol'}}
                  // value={props && props.gameTypeId ? props.gameTypeId : null}
                  style={{width: '100%'}}
                /> */}
            </Form.Item>
            <Form.Item
              name={'receiverId'}
              label='Guest to transfer bill to'
              rules={[{required: true, message: 'Please select a guest'}]}
              hasFeedback
              // style={{width: '100%'}}
              // labelCol={{span: 5}}
            >
              <Select
                id='receiverId'
                // name='paymentMethod'
                className='e-field'
                style={{width: '100%'}}
                placeholder='Guests'
              >
                {guestdata?.data.map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.firstname} {item.lastname}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key='cancel' onClick={cancelBillModal} className='me-3'>
                Cancel
              </Button>
              <Button key='confirm' type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </Modal>
        {/* Payment */}
        <Modal
          open={openPaymentModal}
          okText='Confirm'
          title='Add Payment'
          closable={true}
          onCancel={cancelBillModal}
          // onOk={handleOk}
          footer={null}
        >
          <Form form={paymentForm} onFinish={newPayment} layout='vertical'>
            <Form.Item
              name={'description'}
              label='Description'
              rules={[{required: true, message: 'Please enter description'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='text'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            {/* <Form.Item
              name={'Note'}
              label='Note'
              rules={[{required: true, message: 'Please select a note'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Select
                id='currency'
                // name='currency'
                mode='multiple'
                className='e-field'
                style={{width: '100%'}}
                placeholder='Notes'
              >
                {paymentNotedata?.data.map((item: any) =>
                  item.isPayment ? (
                    <Select.Option key={item.name} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ) : (
                    ''
                  )
                )}
              </Select>
            </Form.Item> */}
            <Form.Item
              name={'credit'}
              label='Amount'
              rules={[{required: true, message: 'Please enter amount'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='number'
                style={{width: '100%'}}
                // onChange={OnChangeHandleValue}
                // defaultValue={value}
                // // value={value} // Utilisation de "value" au lieu de "defaultValue"
                // min={1}
              />
            </Form.Item>
            <Form.Item
              name={'currency'}
              label='Currency'
              rules={[{required: true, message: 'Please select a currency'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Select
                id='currency'
                // name='currency'
                className='e-field'
                style={{width: '100%'}}
                placeholder='Currency'
              >
                {currencydata?.data.map((item: any) => (
                  <Select.Option key={item.symbol} value={item.symbol}>
                    {item.symbol}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={'paymentMethod'}
              label='Payment Method'
              rules={[{required: true, message: 'Please select a payment method'}]}
              hasFeedback
              // style={{width: '100%'}}
              // labelCol={{span: 5}}
            >
              <Select
                id='paymentMethod'
                // name='paymentMethod'
                className='e-field'
                style={{width: '100%'}}
                placeholder='paymentMethod'
                onChange={paymentMethodChange}
              >
                {activePaymentMethoddata?.data.map((item: any) => (
                  <Select.Option key={item.name} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {paymentMehtodIsCheck && isCompaniesDropdownOpen && (
              <Form.Item
                name={'checkNumber'}
                label='Check Number'
                rules={[{required: true, message: 'Please enter check number'}]}
                hasFeedback
                style={{width: '100%'}}
                labelCol={{span: 8}}
              >
                <Input type='text' style={{width: '100%'}} max={20} />
              </Form.Item>
            )}
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key='cancel' onClick={cancelBillModal} className='me-3'>
                Cancel
              </Button>
              <Button key='confirm' type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </Modal>
        {/* Debit Note */}
        <Modal
          open={openDebitModal}
          okText='Confirm'
          title='Add Debit Note'
          closable={true}
          onCancel={cancelBillModal}
          // onOk={handleOk}
          footer={null}
        >
          <Form form={debitForm} onFinish={newDebit}>
            {/* <Form.Item
              name={'timestamp'}
              label='Date'
              rules={[{required: true, message: 'Please enter a date'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input type='date' style={{width: '100%'}} defaultValue={today} />
            </Form.Item> */}

            <Form.Item
              name={'description'}
              label='Description'
              rules={[{required: true, message: 'Please enter description'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='text'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            {/* <Form.Item
              name={'receiptNumber'}
              label='receipt#'
              rules={[{required: true, message: 'Please enter receipt number (Optional)'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input type='text' style={{width: '100%'}} />
            </Form.Item> */}
            {/* <Form.Item
              name={'Note'}
              label='Note'
              rules={[{required: true, message: 'Please select a note'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Select
                id='note'
                mode='multiple'
                className='e-field'
                style={{width: '100%'}}
                placeholder='Notes'
              >
                {paymentNotedata?.data.map((item: any) =>
                  item.isDebit ? (
                    <Select.Option key={item.name} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ) : (
                    ''
                  )
                )}
              </Select>
            </Form.Item> */}
            <Form.Item
              name={'debit'}
              label='Amount'
              rules={[{required: true, message: 'Please enter amount'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='number'
                style={{width: '100%'}}
                // onChange={OnChangeHandleValue}
                // defaultValue={value}
                // // value={value} // Utilisation de "value" au lieu de "defaultValue"
                // min={1}
              />
            </Form.Item>
            <Form.Item
              name={'currency'}
              label='Currency'
              rules={[{required: true, message: 'Please select a currency'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <DropDownListComponent
                id='currency'
                placeholder='Currency'
                data-name='currency'
                className='e-field'
                dataSource={currencydata?.data}
                fields={{text: 'symbol', value: 'symbol'}}
                // value={props && props.gameTypeId ? props.gameTypeId : null}
                style={{width: '100%'}}
              />
            </Form.Item>
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key='cancel' onClick={cancelBillModal} className='me-3'>
                Cancel
              </Button>
              <Button key='confirm' type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </Modal>
        {/* Credit Note */}
        <Modal
          open={openCreditModal}
          okText='Confirm'
          title='Add Credit Note'
          closable={true}
          onCancel={cancelBillModal}
          // onOk={handleOk}
          footer={null}
        >
          <Form form={creditForm} onFinish={newCredit}>
            {/* <Form.Item
              name={'timestamp'}
              label='Date'
              rules={[{required: true, message: 'Please enter a date'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input type='date' style={{width: '100%'}} defaultValue={today} />
            </Form.Item> */}
            <Form.Item
              name={'description'}
              label='Description'
              rules={[{required: true, message: 'Please enter description'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='text'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            {/* <Form.Item
              name={'Note'}
              label='Note'
              rules={[{required: true, message: 'Please select a note'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Select
                id='currency'
                // name='currency'
                mode='multiple'
                className='e-field'
                style={{width: '100%'}}
                placeholder='Notes'
              >
                {paymentNotedata?.data.map((item: any) =>
                  item.isCredit ? (
                    <Select.Option key={item.name} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ) : (
                    ''
                  )
                )}
              </Select>
            </Form.Item> */}
            <Form.Item
              name={'credit'}
              label='Amount'
              rules={[{required: true, message: 'Please enter amount'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='number'
                style={{width: '100%'}}
                // onChange={OnChangeHandleValue}
                // defaultValue={value}
                // // value={value} // Utilisation de "value" au lieu de "defaultValue"
                // min={1}
              />
            </Form.Item>
            <Form.Item
              name={'currency'}
              label='Currency'
              rules={[{required: true, message: 'Please select a currency'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <DropDownListComponent
                id='currency'
                placeholder='Currency'
                data-name='currency'
                className='e-field'
                dataSource={currencydata?.data}
                fields={{text: 'symbol', value: 'symbol'}}
                style={{width: '100%'}}
              />
            </Form.Item>
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key='cancel' onClick={cancelBillModal} className='me-3'>
                Cancel
              </Button>
              <Button key='confirm' type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </Modal>
        {/* Transfering bills */}
        <Modal
          open={openTransferBillToCompanyModal}
          okText='Confirm'
          title='Transfer  Bill'
          closable={true}
          onCancel={cancelBillToTransferModal}
          footer={null}
        >
          <Form form={billToCompanyForm} onFinish={billsToTransfer} layout='vertical'>
            <Form.Item
              name={'companyId'}
              label='company'
              rules={[{required: true, message: 'Guest does not belong to a company'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Select disabled loading={guestLoad}>
                {companiesdata?.data.map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={'bills'}
              label='Services'
              rules={[{required: true, message: 'Please select bill'}]}
              hasFeedback
              // style={{width: '100%'}}
              // labelCol={{span: 5}}
            >
              <Select
                mode='multiple'
                allowClear
                style={{width: '100%'}}
                placeholder='Please select'
                onChange={handleGuestBillingChange}
                options={guestBillData}
              />
            </Form.Item>
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key='cancel' onClick={cancelBillModal} className='me-3'>
                Cancel
              </Button>
              <Button key='confirm' type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </Modal>
        {/* Transfering bill end */}
      </KTCardBody>
    </div>
  )
}

export {Billing}
