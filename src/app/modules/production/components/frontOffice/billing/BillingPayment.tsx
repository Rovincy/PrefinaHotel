import { Form, Input, Select, Button } from 'antd';

// Define propTypes to ensure correct prop types are passed
type Props = {
    paymentForm: any,
    newPayment: (e: any) => void,
    cancelBillModal: (e: any) => void,
    activePaymentMethoddata: any,
    currencydata: any,
    paymentNotedata: any
}

const BillingPayment: React.FC<Props> = ({ 
    paymentForm,
    newPayment,
    cancelBillModal,
    activePaymentMethoddata,
    currencydata,
    paymentNotedata
}) => {
    return (
        <>
            
          <Form form={paymentForm} onFinish={newPayment} layout='vertical'>
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
                  item.isPayment ? (
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
              <Select
                id='currency'
                // name='currency'
                className='e-field'
                style={{ width: '100%' }}
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
              rules={[{ required: true, message: 'Please select a payment method' }]}
              hasFeedback
            // style={{width: '100%'}}
            // labelCol={{span: 5}}
            >

              <Select
                id='paymentMethod'
                // name='paymentMethod'
                className='e-field'
                style={{ width: '100%' }}
                placeholder='paymentMethod'
              >
                {activePaymentMethoddata?.data.map((item: any) => (
                  <Select.Option key={item.name} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>


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



export default BillingPayment;
