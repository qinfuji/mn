import React from 'react';
import {Button, Input, Form, Layout, Select, Card} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import History from '../../core/history';
import localData from '../../utils/adcode.json';
import StandardTable from '@/components/StandardTable';
const {Header, Content, Footer, Sider} = Layout;
const Option = Select.Option;

@connect(({pointer}) => ({
  pointer,
}))
@Form.create()
class List extends React.Component {
  entryCreatePointer = () => {
    History.push('/createPointAddress');
  };

  renderSearch() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const province = getFieldValue('province');
    const city = getFieldValue('city');
    const citys = localData.city[province] || [];
    const districts = localData.district[city] || [];
    return (
      <Form layout="inline">
        <Form.Item label="省份">
          {getFieldDecorator('province', {
            initialValue: province || 100000,
          })(
            <Select size="small" allowClear placeholder="请选择" style={{width: 100}} onChange={this.provinceChange}>
              {localData.province.map((o) => {
                return (
                  <Option key={o.key} value={o.key}>
                    {o.label}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="市">
          {getFieldDecorator('city', {})(
            <Select size="small" allowClear placeholder="请选择" style={{width: 100}} onChange={this.cityChange}>
              {citys.map((o) => {
                return (
                  <Option key={o.key} value={o.key}>
                    {o.label}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="区县">
          {getFieldDecorator('district', {})(
            <Select size="small" allowClear placeholder="请选择" style={{width: 100}} onChange={this.districtChange}>
              {districts.map((o) => {
                return (
                  <Option key={o.key} value={o.key}>
                    {o.label}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="地址">
          {getFieldDecorator('address', {})(<Input size="small" style={{width: 100}}></Input>)}
        </Form.Item>
        <Form.Item label="状态">
          {getFieldDecorator('estimateState', {})(
            <Select style={{width: 80}} size="small">
              <Option value={1}>未评估</Option>
              <Option value={2}>待评估</Option>
              <Option value={3}>已评估</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" size="small" onClick={this.onSearch}>
            查询
          </Button>
          &nbsp;&nbsp;
          <Button type="primary" onClick={this.entryCreatePointer} size="small">
            新建点址
          </Button>
        </Form.Item>
      </Form>
    );
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'no',
    },
    {
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '点址名称',
      dataIndex: 'name',
    },
    {
      title: '省',
      dataIndex: 'provinceName',
    },
    {
      title: '市',
      dataIndex: 'cityName',
    },
    {
      title: '区县',
      dataIndex: 'districtName',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (val) => {
        return val;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: (val) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => text,
    },
  ];

  render() {
    const {
      pointer: {data},
    } = this.props;
    console.log(this.props);
    return (
      <Layout style={{width: '100%', height: '100%'}}>
        <Header>
          <div>{this.renderSearch()}</div>
        </Header>
        <Layout style={{width: '100%', height: '100%'}}>
          <Content>
            <Card>
              <StandardTable
                bordered
                selectedRows={[]}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                rowKey="id"
                rowSelection={undefined}
              />
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default List;
