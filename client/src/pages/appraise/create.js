import React from 'react';
import {Form, Select, Button, Input, DatePicker, Tooltip, Switch, Slider, Icon, Card, Row, Col, TreeSelect} from 'antd';
import moment from 'moment';
import {Constant as AppraiseConstant} from '../../models/appraise';
import {fatchAll} from '../../services/categroyLabels';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;

@Form.create()
class CreateAppraise extends React.Component {
  state = {
    treeData: [],
  };

  saveOrUpdate = async (type) => {
    const {
      form: {validateFields},
      saveOrUpdate,
    } = this.props;
    validateFields(async (error, values) => {
      if (error) return;
      if (saveOrUpdate) {
        saveOrUpdate(values, type);
      }
    });
  };

  componentDidMount() {
    setTimeout(async () => {
      const data = await fatchAll();
      this.setState({
        treeData: data,
      });
    }, 100);
  }

  onSave = () => {
    this.saveOrUpdate('save');
  };

  onSubmit = () => {
    this.saveOrUpdate('submit');
  };

  onLabelsChange = (value) => {
    const {onLabelsChange} = this.props;
    if (onLabelsChange) {
      const params = this.props.form.getFieldsValue();
      params.filterLabels = value;
      onLabelsChange(value, params);
    }
  };

  onDistanceChange = (value) => {
    const {onDistanceChange} = this.props;
    if (onDistanceChange) {
      const params = this.props.form.getFieldsValue();
      params.distance = value;
      onDistanceChange(value, params);
    }
  };

  render() {
    const {
      form: {getFieldDecorator},
      pointerAddress,
      appraise,
      onCompetitorIdsChange,
      competitors,
      userHotFencePolygons,
      goBackList,
      onCreateUserFenceHandle,
    } = this.props;

    const fenceHotDate = [];
    if (appraise && appraise.fencesHotDate) {
      const strDates = appraise.fencesHotDate.split(';');
      fenceHotDate.push(moment(strDates[0]));
      fenceHotDate.push(moment(strDates[1]));
    }

    return (
      <div className="pointerCreate">
        <Card title={`评估点：${pointerAddress.name}`} bordered={false}>
          <Form>
            <Form.Item label="业态标签">
              {getFieldDecorator('filterLabels', {
                initialValue: appraise && appraise.filterLabels ? appraise.filterLabels.split(',') : [],
              })(
                <TreeSelect
                  dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                  placeholder="请选择"
                  allowClear
                  multiple
                  onChange={this.onLabelsChange}
                  treeData={this.state.treeData}
                ></TreeSelect>,
              )}
            </Form.Item>
            <Form.Item label="竞对呈现">
              {getFieldDecorator('competitorIds', {
                initialValue: appraise && appraise.competitorIds ? appraise.competitorIds.split(',') : [],
              })(
                <Select mode="multiple" placeholder="请选择" style={{width: '100%'}} onChange={onCompetitorIdsChange}>
                  {competitors.map((c) => {
                    if (c.id !== pointerAddress.id) {
                      return (
                        <Option key={c.id} value={c.id}>
                          {c.name}
                        </Option>
                      );
                    } else {
                      return null;
                    }
                  })}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="到访百分比">
              {getFieldDecorator('arriveScale', {
                initialValue: appraise && appraise.arriveScale ? parseInt(appraise.arriveScale) / 10 : 0.1,
              })(<Slider step={0.1} max={100} min={0.1} />)}
            </Form.Item>
            <Form.Item label="辐射距离">
              {getFieldDecorator('distance', {
                initialValue: appraise && appraise.distance ? parseInt(appraise.distance) : 1000,
              })(
                <Slider
                  marks={{
                    1000: '1KM',
                    1500: '1.5KM',
                    2000: '2KM',
                    2500: '2.5KM',
                    3000: '3KM',
                  }}
                  step={500}
                  max={3000}
                  min={1000}
                  onChange={this.onDistanceChange}
                />,
              )}
            </Form.Item>
            <Form.Item label="存量人口">
              {getFieldDecorator('showPersonCount', {
                initialValue:
                  appraise && appraise.showPersonCount != null && typeof appraise.showPersonCount != 'undefined'
                    ? appraise.showPersonCount === 0
                      ? false
                      : true
                    : false,
                valuePropName: 'checked',
              })(<Switch size="small" checkedChildren="显示" unCheckedChildren="不显示" />)}
            </Form.Item>
            <Form.Item label="热力分析">
              <Card id="hotCard">
                <Row>
                  <Col>
                    {(!appraise || (appraise && appraise.state === AppraiseConstant.status.STATUS_WAIT_COMMIT)) && (
                      <Button type="primary" size="small" onClick={onCreateUserFenceHandle}>
                        新建围栏
                      </Button>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {userHotFencePolygons &&
                      userHotFencePolygons.map((userHotFence) => {
                        return (
                          <Input
                            readOnly
                            key={userHotFence.id}
                            value={userHotFence.options.path.join(';')}
                            suffix={
                              (!appraise ||
                                (appraise && appraise.state === AppraiseConstant.status.STATUS_WAIT_COMMIT)) && (
                                <Tooltip title="删除围栏">
                                  <Icon
                                    type="delete"
                                    style={{color: 'rgba(0,0,0,.45)'}}
                                    onClick={() => {
                                      this.onRemoveUserHotFence(userHotFence);
                                    }}
                                  />
                                </Tooltip>
                              )
                            }
                          />
                        );
                      })}
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col span={8}>选择日期:</Col>
                  <Col span={16}>
                    {getFieldDecorator('fencesHotDate', {
                      initialValue: fenceHotDate,
                    })(<RangePicker />)}
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col>围栏热力条件</Col>
                  <Col>
                    {getFieldDecorator('fenaceHotCondition', {
                      initialValue: appraise && appraise.fenaceHotCondition ? appraise.fenaceHotCondition : '',
                    })(
                      <Select>
                        <Option value={'1'}>人口</Option>
                      </Select>,
                    )}
                  </Col>
                </Row>
              </Card>
            </Form.Item>
            <Form.Item label="测控点">
              {getFieldDecorator('observeId', {
                initialValue: appraise && appraise.observeId ? appraise.observeId : '',
                rules: [{required: true, message: '请选择'}],
              })(
                <Select>
                  <Option value={'1221212'}>测控点1</Option>
                </Select>,
              )}
            </Form.Item>
          </Form>
          <div id="btnbar" style={{marginTop: '20px'}}>
            {(!appraise || (appraise && appraise.state === AppraiseConstant.status.STATUS_WAIT_COMMIT)) && (
              <Button size="small" type="primary" onClick={this.onSave}>
                保存
              </Button>
            )}
            {(!appraise || (appraise && appraise.state === AppraiseConstant.status.STATUS_WAIT_COMMIT)) && (
              <Button size="small" type="primary" onClick={this.onSubmit}>
                保存并提交
              </Button>
            )}
            <Button size="small" type="primary" onClick={goBackList}>
              返回列表
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}

export default CreateAppraise;
