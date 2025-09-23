import { Form, Input, Select, Button } from 'antd';

type Props = {
    paymentForm: any,
    newBillTransfer: (e: any) => void,
    cancelBillModal: (e: any) => void,
    currencydata: any,
    guestdata: any
}

const BillingTranfer: React.FC<Props> = ({
    paymentForm,
    newBillTransfer,
    cancelBillModal,
    currencydata,
    guestdata
}) => {
    return (
        <>
            <Form form={paymentForm} onFinish={newBillTransfer} layout='vertical'>
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
              name={'amount'}
              label='Payment'
              rules={[{ required: true, message: 'Please enter amount' }]}
              hasFeedback
              style={{ width: '100%' }}
              labelCol={{ span: 5 }}
            >
              <Input
                type='number'
                style={{ width: '100%' }}
              //   disabled={!priceValue}
              //   onChange={onChangeForPrice}
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
              name={'receiverId'}
              label='Guest to transfer bill to'
              rules={[{ required: true, message: 'Please select a guest' }]}
              hasFeedback
            // style={{width: '100%'}}
            // labelCol={{span: 5}}
            >

              <Select
                id='receiverId'
                // name='paymentMethod'
                className='e-field'
                style={{ width: '100%' }}
                placeholder='Guests'
              >
                {guestdata?.data.map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.firstname} {item.lastname}
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



export default BillingTranfer;
