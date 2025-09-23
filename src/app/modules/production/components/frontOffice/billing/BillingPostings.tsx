import { Form, Input, Select, Button } from 'antd';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

// Define propTypes to ensure correct prop types are passed
type Props = {
    debitForm: any,
    newDebit: (e: any) => void,
    cancelBillModal: (e: any) => void,
    today: any,
    currencydata: any,
    paymentNotedata: any
}

const BillingPostings: React.FC<Props> = ({
    debitForm,
    newDebit,
    cancelBillModal,
    today,
    currencydata,
    paymentNotedata
}) => {
    return (
        <>
            <Form form={debitForm} onFinish={newDebit}>
                <Form.Item
                    name={'timestamp'}
                    label='Date'
                    rules={[{ required: true, message: 'Please enter a date' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <Input
                        type='date'
                        style={{ width: '100%' }}
                        defaultValue={today}
                    />
                </Form.Item>
                <Form.Item
                    name={'description'}
                    label='Description'
                    rules={[{ required: true, message: 'Please enter description' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <Input
                        type='text'
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    name={'receiptNumber'}
                    label='receipt#'
                    rules={[{ required: true, message: 'Please enter receipt number (Optional)' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <Input
                        type='text'
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    name={'Note'}
                    label='Note'
                    rules={[{ required: true, message: 'Please select a note' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <Select
                        id='note'
                        mode='multiple'
                        className='e-field'
                        style={{ width: '100%' }}
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
                </Form.Item>
                <Form.Item
                    name={'debit'}
                    label='Amount'
                    rules={[{ required: true, message: 'Please enter amount' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <Input
                        type='number'
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    name={'currency'}
                    label='Currency'
                    rules={[{ required: true, message: 'Please select a currency' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <DropDownListComponent
                        id='currency'
                        placeholder='Currency'
                        data-name='currency'
                        className='e-field'
                        dataSource={currencydata?.data}
                        fields={{ text: 'symbol', value: 'symbol' }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button key='cancel' onClick={cancelBillModal} className='me-3'>
                        Cancel
                    </Button>
                    <Button key='confirm' type='primary' htmlType='submit'>
                        Confirm
                    </Button>
                </div>
            </Form>
        </>
    )
}



export default BillingPostings;
