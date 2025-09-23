import { Form, Input, Select, Space, Table } from 'antd';

// Define propTypes to ensure correct prop types are passed
type Props = {
    serviceForm: any,
    newService: (e: any) => void,
    totalprice: any,
    handleChangeForService: (e: any) => void,
    servicesOptions: any,
    priceValue: number,
    onChangeForPrice: (e: any) => void,
    onChangeForQuantity: (e: any) => void,
    serviceColumns: any,
    allServiceData: any
}

const CheckInAddService: React.FC<Props> = ({ 
    serviceForm,
    newService,
    totalprice,
    handleChangeForService,
    servicesOptions,
    priceValue,
    onChangeForPrice,
    onChangeForQuantity,
    serviceColumns,
    allServiceData
}) => {
    return (
        <>
            <Form form={serviceForm} onFinish={newService}>
                <Space>
                    <button type='submit' className='btn btn-light-primary me-3'>
                        Add
                    </button>
                    <div>
                        <span className='btn text-primary mr-0'>Total:{totalprice}</span>
                    </div>
                </Space>
                <Form.Item
                    name={'name'}
                    label='Service'
                    rules={[{ required: true, message: 'Please enter item' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <Select onChange={handleChangeForService} options={servicesOptions} />
                </Form.Item>
                <Form.Item
                    name={'price'}
                    label='price'
                    rules={[{ required: true, message: 'Please enter price' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <Input
                        type='number'
                        style={{ width: '100%' }}
                        disabled={!priceValue}
                        onChange={onChangeForPrice}
                    />
                </Form.Item>
                <Form.Item
                    name={'quantity'}
                    label='quantity'
                    rules={[{ required: true, message: 'Please enter quantity' }]}
                    hasFeedback
                    style={{ width: '100%' }}
                    labelCol={{ span: 5 }}
                >
                    <Input
                        type='number'
                        style={{ width: '100%' }}
                        onChange={onChangeForQuantity}
                    />
                </Form.Item>
            </Form>
            <Table
                columns={serviceColumns}
                dataSource={allServiceData}
                className='table-responsive'
            />
        </>
    )
}



export default CheckInAddService;
