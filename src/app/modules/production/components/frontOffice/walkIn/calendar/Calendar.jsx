import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars'
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useEffect, useState, useRef} from 'react'
import {ButtonComponent} from '@syncfusion/ej2-react-buttons'
import '@syncfusion/ej2-base/styles/material.css'
import '@syncfusion/ej2-calendars/styles/material.css'
import '@syncfusion/ej2-dropdowns/styles/material.css'
import '@syncfusion/ej2-inputs/styles/material.css'
import '@syncfusion/ej2-lists/styles/material.css'
import '@syncfusion/ej2-navigations/styles/material.css'
import '@syncfusion/ej2-popups/styles/material.css'
import '@syncfusion/ej2-splitbuttons/styles/material.css'
import '@syncfusion/ej2-react-schedule/styles/material.css'
import '@syncfusion/ej2-buttons/styles/material.css'
import {Alert, message, Space, Spin, Modal, Switch, Table, Select} from 'antd'
import axios from 'axios'
import {L10n, createElement} from '@syncfusion/ej2-base'
import {
  ScheduleComponent,
  Month,
  Week,
  ViewsDirective,
  ViewDirective,
  TimelineViews,
  TimelineMonth,
  Inject,
  ResourcesDirective,
  ResourceDirective,
  Resize,
  DragAndDrop,
} from '@syncfusion/ej2-react-schedule'
import {
  fetchRooms,
  fetchGuests,
  fetchBookings,
  fetchRoomsTypes,
  fetchNationalities,
  auditTrail,
} from '../../../../../../services/ApiCalls'
import {BASE_URL} from '../../../../urls'
import './index.css'
import './cellColor.css'
import {useNavigate} from 'react-router-dom'
import dayjs from 'dayjs'
import {useAuth} from '../../../../../auth'

L10n.load({
  'en-US': {
    schedule: {
      saveButton: 'Book',
      cancelButton: 'Close',
      deleteButton: 'Cancel booking',
      newEvent: 'Book Room',
    },
  },
})

const Calendar = () => {
  // USENAVIGATE //
  let navigate = useNavigate()

  // USEREF //
  const scheduleObj = useRef(null)
  // USEREF //

  // USEQUERYCLIENT //
  let queryClient = useQueryClient()
  // USEQUERYCLIENT //

  // USEQUERY //
  const {data: roomsdata, isLoading: roomsLoad} = useQuery('rooms', fetchRooms)
  const {data: guestsdata, isLoading: guestsLoad} = useQuery('guests', fetchGuests)
  const {data: bookingdata, isLoading: bookingsLoad} = useQuery('bookings', fetchBookings)
  const {data: nationalityData, isLoading: nationalityLoad} = useQuery(
    'nationalities',
    fetchNationalities
  )
  const {data: roomsTypes} = useQuery('roomType', fetchRoomsTypes)
  // USEQUERY //

  // USESTATE //
  const [validationError, setValidationError] = useState()
  // USESTATE //

  // USEMUTATION //
  // ADD NEW BOOKING
  const {mutate: addNewBooking} = useMutation((values) => axios.post(`${BASE_URL}/Booking`, values))
  // DELETE BOOKING
  const {mutate: CancelBooking} = useMutation((values) =>
    axios.delete(`${BASE_URL}/Booking/${values}`)
  )
  // ADD NEW GUEST BOOKING
  const {mutate: addNewGuestBooking} = useMutation((values) =>
    axios.post(`${BASE_URL}/Booking/NewGuestBooking`, values)
  )

  const {mutate: addAuditTrail} = useMutation((values) => auditTrail(values))
  // USEMUTATION //

  const [calendFinalData, setCalendFinalData] = useState([])
  const [isSwitchOn, setSwitchOn] = useState(false)
  const {currentUser, logout} = useAuth()

  const listData = guestsdata?.data.map((e) => {
    return {
      id: e?.id,
      name: e?.firstname?.trim() + ' ' + e?.lastname?.trim(),
    }
  })

  var color = '#006400'

 
  const onActionBegin = (args) => {
    if (args.data !== undefined) {
      const data = args.data[0] ? args.data[0] : args.data
      const dat = roomsdata?.data.find((e) => e.name === args?.data[0].Room)

      if (args.requestType === 'eventCreate') {
        
          const bookingSchedule = {
            roomId: dat['id'],
            bookStart: data.StartTime,
            bookEnd: data.EndTime,
            guestId: data.guests,
            timestamp: new Date(),
            price: data.price,
          }

          if (!data.StartTime || !data.EndTime) {
            message.error('Book Start Or Book End is required')
            return
          }

          if (!data.guests || !data.price||!dat['id']) {
            message.error('Please fill all required fields')
            return
          }

          addNewBooking(bookingSchedule, {
            onSuccess: () => {
              var data = {
                userId: currentUser?.id,
                description: `Booked ${dat.name.trim()} at $` + bookingSchedule.price,
              }
              message.success('Booking made successfully')
            },

            onError: (error) => {
              console.log(error)
              message.error('Booking failed, please check booking period.')
            },
          })
      }
      
      if (args.requestType === 'eventRemove') {
        CancelBooking(args.data[0].Id, {
          onSuccess: () => {
            message.success('Booking cancelled successfully')
          },
          onError: (error) => {
            message.error('Booking cancellation failed.')
          },
        })
      }
    }
  }
  let dropDownListObject //to access the dropdownlist component
  function editorTemplate(props) {
    // console.log('rooms data', roomsdata?.data)
    var roomName
    var roomPrice
    roomsdata?.data.find((item) => {
      if (item['id'] == props.RoomId) {
        roomName = item.name

        roomPrice = roomsTypes.data.filter((el) => {
          return el.id === item?.typeId
        })[0]?.price

        return item.name
      }
    })
    // console.log('props: ', roomPrice)
    var startT = props['StartTime']
    var Room = props['Name']
    return props !== undefined ? (
      <table className='custom-event-editor' style={{width: '100%'}} cellPadding={5}>
        <tbody>          
          <tr>
            <td className='e-textlabel'>Room</td>
            <td colSpan={4}>
              <input
                id='title'
                placeholder='Room'
                data-name='Room'
                name='Room'
                className='e-field e-input'
                type='text'
                style={{width: '100%'}}
                defaultValue={roomName}
                disabled
              />
            </td>
          </tr>

          <tr>
            <td className='e-textlabel'>Guest</td>
            <td colSpan={4}>
              <DropDownListComponent
                id='guests'
                placeholder='Guest Name'
                data-name='guests'
                className='e-field'
                dataSource={listData}
                fields={{text: 'name', value: 'id'}}
                allowFiltering={true}
                style={{width: '100%'}}
              />
            </td>
          </tr>
          <tr>
            <td className='e-textlabel'>From</td>
            <td colSpan={4}>
              <DateTimePickerComponent
                id='StartTime'
                format='dd/MM/yy hh:mm a'
                data-name='StartTime'
                name={'StartTime'}
                value={props['StartTime'] ? props['StartTime'] : props['StartTime']}
                className='e-field'
                min={new Date()}
              ></DateTimePickerComponent>
            </td>
          </tr>
          <tr>
            <td className='e-textlabel'>To</td>
            <td colSpan={4}>
              <DateTimePickerComponent
                id='EndTime'
                format='dd/MM/yy hh:mm a'
                data-name='EndTime'
                name={'EndTime'}
                value={props['EndTime'] ? props['EndTime'] : props['EndTime']}
                className='e-field'
                // min={new Date()}
              ></DateTimePickerComponent>
            </td>
          </tr>
          <tr>
            <td className='required e-textlabel'>Price</td>
            <td colSpan={4}>
              <input
                type='number'
                id='price'
                data-name='price'
                defaultValue={roomPrice}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value)
                  if (isNaN(newValue) || newValue <= 0) {
                    e.target.value = ''
                  } else if (newValue > roomPrice) {
                    e.target.value = roomPrice
                  }
                }}
                className='e-field e-input'
              />
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      message.error('Please select an event')
    )
  }

  let onCellClick = (args) => {
    const today = new Date(Date.now())
    const startTime = new Date(args.startTime)
    args.cancel = true
  }

  function onEventRendered(args) {
    args.element.style.backgroundColor = args.data.color
  }
  const book = bookingdata?.data

  function test(e) {
    book?.find((x) => {
      if (x.bookStart === '2023-06-03T00:00:00') {
        return x
      }
    })
  }

  function onRenderCell(args) {}

  const footerTemplate = (props) => {
    return (
      <div className='quick-info-footer'>
        {props.elementType === 'event' ? (
          <div className='cell-footer'>
            <ButtonComponent id='more-details' cssClass='e-flat' content='More Details' />
            <ButtonComponent id='add' cssClass='e-flat' content='Add' isPrimary={true} />
          </div>
        ) : (
          <div className='event-footer'>
            <ButtonComponent id='delete' cssClass='e-flat' content='Delete' />
            <ButtonComponent
              id='more-details'
              cssClass='e-flat'
              content='More Details'
              isPrimary={true}
            />
          </div>
        )}
      </div>
    )
  }

  const roomsArr = []
  const joinedData = roomsdata?.data.filter((room) => {
    const matchingType = roomsTypes?.data.find((type) => type.id === room.typeId)

    if (matchingType) {
      var roomObj = {roomId: room.id, roomName: room.name, roomType: matchingType.name}
      roomsArr.push(roomObj)
      return roomObj
    } else {
      return false
    }
  })
  const getRoomName = (value) => {
    return value.resourceData[value.resource.textField]
  }
  const getRoomType = (value) => {
    return value.resourceData.roomType
  }
  const resourceHeaderTemplate = (props) => {
    return (
      <div className='template-wrap'>
        <div className='room-name'>{getRoomName(props)}</div>
        {/* <div className='room-type'>{getRoomType(props)}</div> */}
      </div>
    )
  }

  const OnPopupClose = (args) => {}
  const handleSwitchChange = (checked) => {
    setSwitchOn(checked)
  }
  const columns = [
    {
      dataIndex: '',
      sorter: (a, b) => {
        if (a.color > b.color) {
          return 1
        }
        if (b.color > a.color) {
          return -1
        }
        return 0
      },
      render: (text, record) => (
        <div
          style={{
            backgroundColor: record.color,
            width: '30px',
            height: '30px',
            borderRadius: '50%',
          }}
        ></div>
      ),
    },
    {
      title: 'Room',
      dataIndex: 'name',
      sorter: (a, b) => {
        if (a.Subject > b.Subject) {
          return 1
        }
        if (b.Subject > a.Subject) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'RoomType',
      dataIndex: 'roomType',
      sorter: (a, b) => {
        if (a.Subject > b.Subject) {
          return 1
        }
        if (b.Subject > a.Subject) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Guest',
      dataIndex: 'guest',
      sorter: (a, b) => {
        if (a.Subject > b.Subject) {
          return 1
        }
        if (b.Subject > a.Subject) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Arrival',
      dataIndex: 'bookStart',
      sorter: (a, b) => {
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
      title: 'Departure',
      dataIndex: 'bookEnd',
      sorter: (a, b) => {
        if (a.bookEnd > b.bookEnd) {
          return 1
        }
        if (b.bookEnd > a.bookEnd) {
          return -1
        }
        return 0
      },
    },
  ]

  return roomsdata !== undefined ? (
    <div className='schedule-control-section'>
      <div className='col-lg-12 control-section'>
        <div className='control-wrapper'>
          {/* <Switch checked={isSwitchOn} onChange={handleSwitchChange} /> */}
          {/* <p>{isSwitchOn ? 'Booking List View' : 'Booking Calendar View'}</p> */}
          {/* {isSwitchOn ? (
            <Table
              columns={columns}
              dataSource={listViewData}
              loading={bookingsLoad}
              className='table-responsive'
            />
          ) : ( */}
            <ScheduleComponent
              cssClass='timeline-resource'
              currentView='TimelineMonth'
              selectedDate={new Date(dayjs().format('YYYY-MM-DD'))}
              maxDate={new Date(dayjs().add(4, 'month'))}
              ref={scheduleObj}
              actionBegin={onActionBegin}
              editorTemplate={editorTemplate}
              eventRendered={onEventRendered}
              OnPopupClose={OnPopupClose}
              resourceHeaderTemplate={resourceHeaderTemplate}
              cellClick={onCellClick}
              renderCell={onRenderCell.bind(this)}
              loading={true}
              width='100%'
              height='650px'
              group={{enableCompactView: false, resources: ['MeetingRoom']}}
              eventSettings={{
                dataSource: bookingdata?.data?.map((item) => {
                  const allGuests = guestsdata?.data?.filter((data) => {
                    return data.id === item.guestId
                  })
                  if (item.checkInTime === null) {
                    return {
                      Id: item.id,
                      Subject: allGuests
                        ? `${allGuests[0]?.firstname?.trim()} ${allGuests[0]?.lastname?.trim()}`
                        : null,
                      StartTime: item.bookStart,
                      EndTime: item.bookEnd,
                      RoomId: item.roomId,
                      checkInTime: item.checkInTime,
                      color: '#D3D3D3',
                    }
                  } else {
                    return {
                      Id: item.id,
                      Subject: allGuests
                        ? `${allGuests[0]?.firstname?.trim()} ${allGuests[0]?.lastname?.trim()}`
                        : null,
                      StartTime: item.bookStart,
                      EndTime: item.bookEnd,
                      RoomId: item.roomId,
                      checkInTime: item.checkInTime,
                      color:"#4E3B2A"
                    }
                  }
                }),
                fields: {
                  id: 'Id',
                  subject: {title: 'Guest', name: 'Subject'},
                  startTime: {title: 'From', name: 'StartTime'},
                  endTime: {title: 'To', name: 'EndTime'},
                },
              }}
            >
              <ResourcesDirective>
                <ResourceDirective
                  field='RoomId'
                  title='Room Type'
                  name='MeetingRoom'
                  allowMultiple={true}
                  dataSource={roomsArr}
                  load={bookingsLoad}
                  textField='roomName'
                  idField='roomId'
                ></ResourceDirective>
              </ResourcesDirective>
              <ViewsDirective>
                <ViewDirective
                  option='TimelineMonth'
                  interval={4}
                  selectedDate={new Date(dayjs())}
                />
              </ViewsDirective>
              <Inject services={[TimelineViews, TimelineMonth, Week, Month, Resize, DragAndDrop]} />
            </ScheduleComponent>
          {/*  )} */}
        </div>
      </div>
    </div>
  ) : (
    <Space size='middle'>
      <Spin size='large' />
    </Space>
  )
}
export {Calendar}
