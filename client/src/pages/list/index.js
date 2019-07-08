import React from 'react';
import {Button, Input, Form, Layout, Select, Card} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import History from '../../core/history';
import localData from '../../utils/adcode.json';
import StandardTable from '@/components/StandardTable';
import {Constant as PointerAddressConstant} from '../../models/pointerAddress';
const {Header, Content, Footer, Sider} = Layout;
const Option = Select.Option;

@connect(({pointerAddress}) => ({
  pointerAddress,
}))
@Form.create()
class PointerList extends React.Component {
  state = {};

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
          {getFieldDecorator('state', {})(
            <Select allowClear style={{width: 100}} size="small">
              {Object.keys(PointerAddressConstant.statusLabels).map((key) => {
                return (
                  <Option key={key} value={key}>
                    {PointerAddressConstant.statusLabels[key]}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" size="small" onClick={this.onSearchHandler}>
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

  enterCreatePointer = (id) => {
    History.push('/createPointAddress/' + id);
  };

  columns = [
    /*{
      title: '序号',
      dataIndex: 'no',
    },
    {
      title: '编号',
      dataIndex: 'code',
    },*/
    {
      title: '点址名称',
      dataIndex: 'name',
    },
    {
      title: '省',
      width: '80px',
      dataIndex: 'provinceName',
    },
    {
      title: '市',
      width: '120px',
      dataIndex: 'cityName',
    },
    {
      title: '区县',
      width: '100px',
      dataIndex: 'districtName',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '状态',
      width: '70px',
      sorter: true,
      dataIndex: 'state',
      render: (val) => {
        const cn = 'state ' + val;
        return <span className={cn}>{PointerAddressConstant.statusLabels[val]}</span>;
      },
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createdTime',
      render: (val) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => {
        const status = PointerAddressConstant.status;
        if (record.state === status.STATUS_WAIT_SUBMIT) {
          return (
            <Button className="operationBtn" size="small" onClick={() => this.enterCreatePointer(record.id)}>
              点址管理
            </Button>
          );
        }
        if (record.state === status.STATUS_NOT_ESTIMATE) {
          return (
            <React.Fragment>
              <Button className="operationBtn" size="small" onClick={() => this.enterCreatePointer(record.id)}>
                点址管理
              </Button>
              <Button size="small">请求评估</Button>
            </React.Fragment>
          );
        }
        if (record.state === status.STATUS_WAIT_ESTIMATE) {
          return (
            <Button type="primary" size="small">
              待评估
            </Button>
          );
        }
        if (record.state === status.STATUS_ESTIMATE_FINISH) {
          return '评估完成';
        }
        if (record.state === status.STATUS_ALL_FINISH) {
          return '结论完成';
        }
        if (record.state === status.STATUS_DELETE) {
          return '';
        }
      },
    },
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'pointerAddress/fetch',
      payload: {
        pageSize: 20,
        pageIndex: 1,
        orderby: 'created_time desc',
      },
    });
  }

  onSearchHandler = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      delete fieldsValue.password;
      const values = {
        ...fieldsValue,
      };
      if (values.district) {
        values.scope = 'district';
        values.adcode = values.district;
      } else if (values.city) {
        values.scope = 'city';
        values.adcode = values.city;
      } else if (values.province && values.province !== 100000) {
        values.scope = 'province';
        values.adcode = values.province;
      }
      values.orderby = 'created_time desc';

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'pointerAddress/fetch',
        payload: {
          pageSize: 20,
          pageIndex: 1,
          ...values,
        },
      });
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const params = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    if (sorter.field) {
      const order = sorter.order.replace(/end$/g, '');
      let sortField = sorter.field;
      if (sorter.field === 'createdTime') {
        sortField = 'created_time';
      }
      params.orderby = `${sortField} ${order}`;
    }
    dispatch({
      type: 'pointerAddress/fetch',
      payload: params,
    });
  };

  render() {
    const {
      pointerAddress: {data},
    } = this.props;
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

export default PointerList;
