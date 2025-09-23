import { Form, Input, DatePicker, Space, Button } from 'antd'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns/src/drop-down-list/dropdownlist.component'

// Define propTypes to ensure correct prop types are passed
type Props = {
    transferForm: any,
    newTransfer: (e: any) => void,
    roomsdata: any,
    selectedItemBookEnd: any,
    cancelTransferModal: (e: any) => void,
    isUnAvailable: any,
    submitTransfer: (e: any) => void
}

const CheckInSelectNewRoom: React.FC<Props> = ({
    transferForm,
    newTransfer,
    roomsdata,
    selectedItemBookEnd,
    cancelTransferModal,
    isUnAvailable,
    submitTransfer
}) => {
    return (
        <>
            <Form form={transferForm} onFinish={newTransfer}>
                <Form.Item
                    name={'roomId'}
                    label='Room'
                    rules={[{ required: true, message: 'Please select a room' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <DropDownListComponent
                        id='room'
                        placeholder='Room'
                        data-name='room'
                        className='e-field'
                        dataSource={roomsdata?.data}
                        fields={{ text: 'name', value: 'id' }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    name={'bookEnd'}
                    label='End Date'
                    rules={[{ required: true, message: 'Please select a date' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <DatePicker
                        showTime
                        format='dddd, MMMM D, YYYY HH:mm'
                        className='e-field'
                        value={selectedItemBookEnd}
                        defaultOpen={selectedItemBookEnd}
                        defaultValue={selectedItemBookEnd}
                        defaultPickerValue={selectedItemBookEnd}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button key='cancel' onClick={cancelTransferModal} className='me-3'>
                        Cancel
                    </Button>
                    <Button key='checkAvailability' type='primary' htmlType='submit' className='me-3'>
                        Check Availability
                    </Button>
                    <Button
                        key='submit'
                        type='primary'
                        className='btn btn-danger text-center'
                        disabled={isUnAvailable}
                        onClick={submitTransfer}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        Confirm
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default CheckInSelectNewRoom;
