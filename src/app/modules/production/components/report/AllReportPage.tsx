import {Link} from 'react-router-dom'
import {useAuth} from '../../../auth'
const AllReportPage = () => {
  const {currentUser} = useAuth()

  return (
    <div>
      <div className='row col-12 mb-10'>
        <div
          className='col-4'
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            margin: '0px 10px 0px 10px',
            boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
          }}
        >
          <div className='row m-0'>
            <div className='col-12 m-2'>
            <h2><span className="bullet me-5"></span><Link to="/InvoiceSummaryReport">Invoice</Link></h2>
            <h2><span className="bullet me-5"></span><Link to="/ReceiptReport">Receipt</Link></h2>
            <h2><span className="bullet me-5"></span><Link to="/GuestHistoryReport">Guest History</Link></h2>
            <h2><span className="bullet me-5"></span><Link to="/InHouseReport">In House Guests Report</Link></h2>
            <h2><span className="bullet me-5"></span><Link to="/CheckOutReport">Check-Out Report</Link></h2>
            <h2><span className="bullet me-5"></span><Link to="/RoomsExpectedAmountsReport">Rooms Expected Amounts Report</Link></h2>
            <h2><span className="bullet me-5"></span><Link to="/GuestsPaymentsReport">Guests Payments Report</Link></h2>
            </div>

          </div>

          </div>
       
      </div>
    </div>
  )
}

export {AllReportPage}
