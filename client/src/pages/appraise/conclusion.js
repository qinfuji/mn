import React from 'react';
import {Form, Select, Button, Card, Row, Col, Table} from 'antd';
import moment from 'moment';
import {Constant as AppraiseConstant} from '../../models/appraise';
import Authorized from '../../utils/Authorized';
const {Option} = Select;

@Form.create()
class Conclusion extends React.Component {
  onSave = () => {
    const {
      form: {validateFields},
      onSave,
    } = this.props;
    validateFields(async (error, values) => {
      if (error) return;
      if (onSave) {
        onSave(values);
      }
    });
  };

  render() {
    const {
      form: {getFieldDecorator},
      pointerAddress,
      appraiseDataResult,
      goBackList,
    } = this.props;

    return (
      <div id="conclusion">
        <Card title={`点址名称:${pointerAddress.name}`} bordered={false}>
          <Row>
            <Col>
              <Form layout="horizontal">
                <Form.Item label="到访围栏人口数量">
                  <Table
                    bordered
                    size="small"
                    columns={[
                      {
                        title: '类型',
                        dataIndex: 'type',
                      },
                      {
                        title: '数量',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item>
                  <div>
                    测控客流量:
                    {appraiseDataResult && appraiseDataResult.observerRateFlow
                      ? appraiseDataResult.observerRateFlow
                      : '0'}
                  </div>
                </Form.Item>
                <Form.Item label="点址结论">
                  {getFieldDecorator('conclusion', {
                    initialValue:
                      appraiseDataResult && appraiseDataResult.conclusion ? appraiseDataResult.conclusion : '',
                    rules: [{required: true, message: '请选择'}],
                  })(
                    <Select placeholder="请选择">
                      <Option value={'1'}>攻坚</Option>
                      <Option value={'2'}>独占</Option>
                      <Option value={'3'}>主动分流</Option>
                      <Option value={'4'}>被动分流</Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item label="准入时间">
                  {getFieldDecorator('enterDate', {
                    initialValue:
                      appraiseDataResult && appraiseDataResult.enterDate ? appraiseDataResult.enterDate : '',
                    rules: [{required: true, message: '请选择'}],
                  })(
                    <Select>
                      <Option value={'2019'}>2019年</Option>
                      <Option value={'2020'}>2020年</Option>
                      <Option value={'2021'}>2021年</Option>
                      <Option value={'2022'}>2022年</Option>
                      <Option value={'2023'}>2023年</Option>
                      <Option value={'2024'}>2024年</Option>
                      <Option value={'2025'}>2025年</Option>
                      <Option value={'2026'}>2026年</Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item label="商圈类型">
                  {getFieldDecorator('businessType', {
                    initialValue:
                      appraiseDataResult && appraiseDataResult.businessType ? appraiseDataResult.businessType : '',
                    rules: [{required: true, message: '请选择'}],
                  })(
                    <Select>
                      <Option value={'1'}>类型一</Option>
                      <Option value={'2'}>类型二</Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  {/*<div>
                    辐射距离:
                    {appraiseDataResult && appraiseDataResult.radiationDistance
                      ? appraiseDataResult.radiationDistance
                      : '0'}
                  </div>*/}
                </Form.Item>
                <Form.Item>
                  <label>
                    辐射面积:
                    {appraiseDataResult && appraiseDataResult.radiationArea
                      ? parseFloat(appraiseDataResult.radiationArea).toFixed(3) + '平方公里'
                      : '0'}
                  </label>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
        <div id="btnbar" style={{textAlign: 'end'}}>
          {(!appraiseDataResult ||
            appraiseDataResult.state !== AppraiseConstant.dateReaultState.RESULT_DATE_STATUS_SUBMITED) && (
            <Authorized authority="/conclusionManager/save">
              <Button type="primary" onClick={this.onSave}>
                保存
              </Button>
            </Authorized>
          )}
          <Button type="primary" onClick={goBackList}>
            返回列表
          </Button>
        </div>
      </div>
    );
  }
}

export default Conclusion;
