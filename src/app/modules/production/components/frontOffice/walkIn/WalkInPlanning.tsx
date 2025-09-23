import {Dropdown, MenuProps, Typography} from 'antd'

import {useQuery} from 'react-query'
import {SetStateAction, useState} from 'react'
import {KTCard, KTCardBody, KTSVG} from '../../../../../../_metronic/helpers'
import {Space} from 'antd'
import {Calendar} from './calendar/Calendar'
import {CheckIn} from './checkIn/checkIn'
import {CheckOut} from './checkOut/checkOut'
import {CheckOccupancy} from '../../../../../services/ApiCalls'
import {Occupied} from './occupied/occupied'
import {Button} from 'antd'
import {DueBooking} from './DueBookings/duebooking'
import {Vacant} from './vacant/vacant'

import { ReloadOutlined } from '@ant-design/icons';
import './CustomButton.css'; // Assuming you create a separate CSS file
const WalkInPlanning = () => {
  const {data: roomAvailability, isLoading: roomAvailabilityLoad} = useQuery(
    'roomAvailability',
    CheckOccupancy
  )

  let dropDownListObj: any
  const [chosenFilter, setChosenFilter] = useState(null)
  const [activeButton, setActiveButton] = useState('reservation')

  const {Text} = Typography

  const handleButtonClick = (buttonName: SetStateAction<string>) => {
    setActiveButton(buttonName)
    // console.log(`${buttonName} button clicked!`);
  }

  const renderPage = () => {
    switch (activeButton) {
      case 'occupied':
        return <Occupied />
      case 'reservation':
        return <Calendar />
      case 'checkin':
        return <CheckIn />
      case 'duebookings':
        return <DueBooking />
      case 'checkout':
        return <CheckOut />
      case 'vacant':
        return <Vacant />
      default:
        return null
    }
  }
  //const location = useLocation();

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <>
      <KTCard>
        <KTCardBody className='py-5 px-2 d-flex '>
          {/* <KTCardBody className='py-5 px-2 d-flex justify-content-between'> */}
          <div className='d-flex justify-content-between'>
            <Space>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '4rem',
                  width: '9rem',
                  backgroundColor: activeButton === 'reservation' ? '#B8860B' : '#f5f5f5',
                  borderRadius: '8px',
                  marginLeft: '10px',
                }}
              >
                <button
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: activeButton === 'reservation' ? '#fff' : '#333',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleButtonClick('reservation')}
                >
                  Reservation
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '4rem',
                  width: '9rem',
                  backgroundColor: activeButton === 'checkin' ? '#B8860B' : '#f5f5f5',
                  borderRadius: '8px',
                  marginLeft: '10px',
                }}
              >
                <button
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: activeButton === 'checkin' ? '#fff' : '#333',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleButtonClick('checkin')}
                >
                  Check In
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '4rem',
                  width: '9rem',
                  backgroundColor: activeButton === 'checkout' ? '#B8860B' : '#f5f5f5',
                  borderRadius: '8px',
                  marginLeft: '10px',
                }}
              >
                <button
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: activeButton === 'checkout' ? '#fff' : '#333',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleButtonClick('checkout')}
                >
                  Check Out
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '4rem',
                  width: '9rem',
                  backgroundColor: activeButton === 'occupied' ? '#B8860B' : '#f5f5f5',
                  borderRadius: '8px',
                  marginLeft: '10px',
                }}
              >
                <button
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: activeButton === 'occupied' ? '#fff' : '#333',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleButtonClick('occupied')}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: activeButton === 'occupied' ? '#fff' : '#333',
                    }}
                  >
                    Occupied: {roomAvailability?.data['occupiedRooms']}
                  </Text>
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '4rem',
                  width: '9rem',
                  backgroundColor: activeButton === 'duebookings' ? '#B8860B' : '#f5f5f5',
                  borderRadius: '8px',
                  marginLeft: '10px',
                }}
              >
                <button
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: activeButton === 'duebookings' ? '#fff' : '#333',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleButtonClick('duebookings')}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: activeButton === 'duebookings' ? '#fff' : '#333',
                    }}
                  >
                    Due-Today
                  </Text>
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '4rem',
                  width: '9rem',
                  backgroundColor: activeButton === 'vacant' ? '#B8860B' : '#f5f5f5',
                  borderRadius: '8px',
                  marginLeft: '10px',
                }}
              >
                <button
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: activeButton === 'vacant' ? '#fff' : '#333',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleButtonClick('vacant')}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: activeButton === 'vacant' ? '#fff' : '#333',
                    }}
                  >
                    Vacant: {roomAvailability?.data['vacantRooms']}
                  </Text>
                </button>
              </div>
            </Space>
          </div>

          <div style={{ marginLeft: 'auto' }}>
        <Button
          className='refresh-button'
          icon={<ReloadOutlined rev={0} />}
          onClick={() => handleRefresh()}
        >
          Refresh
        </Button>
      </div>
        </KTCardBody>
        {/* <Calendar chosenFilter={chosenFilter} /> */}
        {renderPage()}
      </KTCard>
    </>
  )
}

export {WalkInPlanning}

// // import axios from 'axios'
// // // import {Calendar} from './calendar/Calendar'
// // import {Link, useNavigate} from 'react-router-dom'api
// // import {useQuery} from 'react-query'
// // import {useState} from 'react'
// // import {KTCard, KTCardBody, KTSVG} from "../../../../../../_metronic/helpers";
// // import {BASE_URL} from "../../../urls";
// // import {Space} from "antd";
// // import {DropDownListComponent} from "@syncfusion/ej2-react-dropdowns";
// // import {fetchDepartments, fetchLeaveTypes} from "../../../../../services/ApiCalls";
// // import Calendar from './calendar/Calendar';

// // const WalkInPlanning = () => {
// //   let dropDownListObj: any
// //   const [chosenFilter, setChosenFilter] = useState(null)
// //   const navigate = useNavigate()

// //   return (
// //     <>
// //       <KTCard>
// //         <KTCardBody className='py-5 px-2'>
// //           <div className='d-flex justify-content-between'>
// //             <Space style={{marginBottom: 16}}>
// //             </Space>
// //           </div>
// //           <Calendar chosenFilter={chosenFilter} />
// //         </KTCardBody>
// //       </KTCard>
// //     </>
// //   )
// // }

// // export {WalkInPlanning}
