import { data } from '@app/components/Groups/Groups.data'
import ViewHeader from '@app/components/ViewHeader'
import { Card, Row, Col, Button, Form, Input, Select } from 'antd'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

const DetailsGroups = () => {
  const { role } = useSelector((state) => state.login)
  const params = useParams()
  const details = data.find((item) => item.id === params.id)
  const breadcrumbs = {
    data: [
      {
        title: 'Groups ',
        path: '/admin/groups',
      },
      {
        title: 'Details ',
      },
    ],
    spread: '/',
  }
  const onFinish = (values) => {
    console.log(values)
  }
  const convertData = (data) =>
    data.map((item) => ({
      value: item.id,
      label: item.name,
    }))
  const options = data
  const mastersData = convertData(details.masters)
  const membersData = convertData(details.members)
  const filter = (input, option) =>
    0 <= option.props.children.toLowerCase().indexOf(input.toLowerCase()) ||
    0 <= option.props.value.toLowerCase().indexOf(input.toLowerCase())

  return (
    <>
      <ViewHeader breadcrumbs={breadcrumbs} />
      <div className="site-card-border-less-wrapper">
        <Card
          bordered={true}
          className="card-boxshadow"
          style={{
            width: '100%',
          }}
          title="You can change data on this form"
        >
          <Row>
            <Col span={12}>
              <Form
                initialValues={{ name: details.name, masters: mastersData, members: membersData }}
                layout={'vertical'}
                onFinish={onFinish}
              >
                <Form.Item
                  label="Name Group"
                  name={'name'}
                  rules={[
                    {
                      required: true,
                      message: 'Please type name group!',
                    },
                  ]}
                >
                  <Input placeholder="Type name group" />
                </Form.Item>
                <Form.Item
                  label="Masters"
                  name={'masters'}
                  rules={[
                    {
                      required: true,
                      message: 'Please type master in group!',
                    },
                  ]}
                >
                  <Select
                    filterOption={(input, option) => filter(input, option)}
                    mode="multiple"
                    placeholder="Choose members"
                  >
                    {options.map((option) => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Members"
                  name={'members'}
                  rules={[
                    {
                      required: true,
                      message: 'Please type members in group!',
                    },
                  ]}
                >
                  <Select
                    filterOption={(input, option) => filter(input, option)}
                    mode="multiple"
                    placeholder="Choose members"
                  >
                    {options.map((option) => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {'Admin' === role && (
                  <Form.Item>
                    <Button htmlType="submit" type="primary">
                      Submit
                    </Button>
                    <Link to={'/admin/groups'}>
                      <Button
                        htmlType="button"
                        style={{
                          margin: '0 8px',
                        }}
                      >
                        Back
                      </Button>
                    </Link>
                  </Form.Item>
                )}
              </Form>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  )
}
export default DetailsGroups
