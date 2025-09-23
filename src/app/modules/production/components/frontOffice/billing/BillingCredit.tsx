import { Form, Input, Select, Button } from 'antd';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

type Props = {
    creditForm: any,
    newCredit: (e: any) => void,
    cancelBillModal: (e: any) => void,
    paymentNotedata: any,
    currencydata: any,
    today: any
}

const BillingCredit: React.FC<Props> = ({
    creditForm,
    newCredit,
    cancelBillModal,
    paymentNotedata,
    currencydata,
    today
}) => {
    return (
        <>
            <Form form={creditForm} onFinish={newCredit}>
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
                    //   disabled={!priceValue}
                    //   onChange={onChangeForPrice}
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
                        id='currency'
                        // name='currency'
                        mode='multiple'
                        className='e-field'
                        style={{ width: '100%' }}
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
                </Form.Item>
                <Form.Item
                    name={'credit'}
                    label='Amount'
                    rules={[{ required: true, message: 'Please enter amount' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <Input
                        type='number'
                        style={{ width: '100%' }}
                    // onChange={OnChangeHandleValue}
                    // defaultValue={value}
                    // // value={value} // Utilisation de "value" au lieu de "defaultValue"
                    // min={1}
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



export default BillingCredit;
