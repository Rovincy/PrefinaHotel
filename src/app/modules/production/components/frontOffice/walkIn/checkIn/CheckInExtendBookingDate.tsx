import {Form, Input, DatePicker, Space} from 'antd'

// Define propTypes to ensure correct prop types are passed
type Props = {
  extendBookEndForm: any
  extendBookOnFinish: (e: any) => void
  bookingData: any
}

const CheckInExtendBookingDate: React.FC<Props> = ({
  extendBookEndForm,
  extendBookOnFinish,
  bookingData,
}) => {
  return (
    <>
      <Space style={{marginBottom: 16, display: 'flex', justifyContent: 'start'}}>
        <Form className='d-flex' form={extendBookEndForm} onFinish={extendBookOnFinish}>
          <Form.Item
            name={'Id'}
            label='Id'
            rules={[{required: true, message: 'Please enter Id'}]}
            hasFeedback
            style={{width: '100%'}}
            labelCol={{span: 5}}
            hidden={true}
          >
            <Input type='text' style={{width: '100%'}} />
          </Form.Item>
          <Form.Item
            name={'roomId'}
            label='roomId'
            rules={[{required: true, message: 'Please enter roomId'}]}
            hasFeedback
            style={{width: '100%'}}
            labelCol={{span: 5}}
            hidden={true}
          >
            <Input type='text' style={{width: '100%'}} />
          </Form.Item>
          <Form.Item
            name='bookEnd'
            label='Book End'
            rules={[
              {
                validator: async (_, value) => {
                  const originalDate = new Date(value)
                  const formattedDate = originalDate.toISOString().split('.')[0]
                  if (value >= extendBookEndForm.getFieldValue('bookEndHidden')) {
                    const data = bookingData?.data?.filter((item: any) => {
                      return (
                        item.roomId === extendBookEndForm.getFieldValue('roomId') &&
                        formattedDate >= item?.bookStart &&
                        formattedDate <= item?.bookEnd
                      )
                    })
                    if (data?.length > 0) {
                      return Promise.reject(
                        new Error('There is already a room for the specified date')
                      )
                    }
                  } else {
                    return Promise.resolve("You're shortening your stay!")
                  }
                },
              },
            ]}
          >
            <DatePicker
              className='form-control form-control-solid'
              showTime={false}
              disabledDate={(current) =>
                current.isBefore(extendBookEndForm.getFieldValue('bookStart'))
              }
            />
          </Form.Item>
          <Form.Item name='bookStart' label='Book Start' hidden={true}>
            <DatePicker className='form-control form-control-solid' showTime />
          </Form.Item>
          <Form.Item name='bookEndHidden' label='Book Start' hidden={true}>
            <DatePicker className='form-control form-control-solid' showTime />
          </Form.Item>
        </Form>
      </Space>
    </>
  )
}

export default CheckInExtendBookingDate
