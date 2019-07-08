import React from 'react';
import {Form, Input, Button, Icon, Tooltip, Select} from 'antd';

import {Constant as PointerAddressConstant} from '../../models/pointerAddress';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create({
  mapPropsToFields(props) {
    return {
      lnglat: props.lnglat,
    };
  },
  //onFieldsChange(props, changedFields) {
  //  console.log(changedFields);
  //props.onChange(changedFields);
  //},
  onValuesChange(props, values) {
    props.onChange(values);
  },
})
class CreatePointer extends React.Component {
  submit = (e) => {
    const {
      form: {validateFields},
      onSubmit,
      pointer: {adCodeInfo},
    } = this.props;
    validateFields((error, values) => {
      if (error) return;
      const reqParams = {...this.props.pointer, ...values, ...adCodeInfo};
      if (onSubmit) {
        onSubmit(reqParams);
      }
    });
  };

  save = () => {
    const {
      form: {validateFields},
      onSave,
      pointer: {adCodeInfo},
    } = this.props;
    validateFields((error, values) => {
      if (error) return;
      const reqParams = {...this.props.pointer, ...values, ...adCodeInfo};
      if (onSave) {
        onSave(reqParams);
      }
    });
  };

  //撤销
  onRevoke = () => {
    const {onRevoke} = this.props;
    if (onRevoke) {
      onRevoke();
    }
  };

  //删除
  onDelete = (pointer) => {};

  //保存
  onSave = (pointer) => {};

  render() {
    const {
      form: {getFieldDecorator},
      pointer = {},
      onRelocation,
      onCreateFence,
      onRemoveFence,
    } = this.props;
    console.log(pointer);
    return (
      <div className="pointerCreate">
        <Form>
          <Form.Item label="类别">
            {getFieldDecorator('type', {
              initialValue: pointer && pointer.type ? parseInt(pointer.type) : '',
              rules: [{required: true, message: '请选择'}],
            })(
              <Select placeholder="请选择">
                <Option value={1}>机会点</Option>
                <Option value={2}>已有店</Option>
                <Option value={3}>竞品店</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="名称">
            {getFieldDecorator('name', {
              initialValue: pointer && pointer.name ? pointer.name : '',
              rules: [{required: true, message: '请填写'}],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="经纬度">
            {getFieldDecorator('lnglat', {
              initialValue: pointer && pointer.lnglat ? pointer.lnglat.lng + ',' + pointer.lnglat.lat : '',
              rules: [{required: true, message: '请填写'}],
            })(
              <Input
                readOnly
                addonAfter={
                  <Tooltip title="点击定位中心">
                    <Icon type="environment" onClick={() => onRelocation(pointer.lnglat)} />
                  </Tooltip>
                }
              />,
            )}
          </Form.Item>
          <Form.Item label="详细地址" extra={pointer && pointer.refAddress ? '参考地址：' + pointer.refAddress : ''}>
            {getFieldDecorator('address', {
              initialValue: pointer && pointer.address ? pointer.address : '',
              rules: [{required: true, message: '请填写'}],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="围栏">
            {getFieldDecorator('fence', {initialValue: pointer && pointer.fence ? pointer.fence : ''})(
              <Input
                suffix={
                  pointer &&
                  pointer.fence && (
                    <Tooltip title="删除围栏">
                      <Icon
                        type="delete"
                        style={{color: 'rgba(0,0,0,.45)'}}
                        onClick={() => {
                          onRemoveFence && onRemoveFence(pointer.fenceId);
                        }}
                      />
                    </Tooltip>
                  )
                }
                addonAfter={
                  <Tooltip title="建立围栏">
                    <Icon type="table" onClick={() => onCreateFence(pointer.lnglat)} />
                  </Tooltip>
                }
              />,
            )}
          </Form.Item>
          <Form.Item label="标签(业态)">
            {getFieldDecorator('labels', {
              initialValue: pointer && pointer.labels ? pointer.labels : '',
              rules: [{required: true, message: '请填写'}],
            })(
              <Select>
                <Option value={1}>标签1</Option>
                <Option value={2}>标签2</Option>
              </Select>,
            )}
          </Form.Item>
        </Form>
        <div style={{marginTop: '40px', display: 'flex', justifyContent: 'flex-end'}}>
          {pointer && !pointer.id && (
            <Button size="small" type="primary" onClick={this.onRevoke}>
              放弃
            </Button>
          )}
          &nbsp;
          {(!pointer.id || pointer.state === PointerAddressConstant.status.STATUS_WAIT_SUBMIT) && (
            <React.Fragment>
              <Button size="small" type="primary" onClick={this.save}>
                保存
              </Button>
              &nbsp;
              <Button size="small" type="primary" onClick={this.submit}>
                保存并提交
              </Button>
              &nbsp;
            </React.Fragment>
          )}
          {pointer && pointer.id && (
            <Button size="small" type="primary" onClick={this.onDelete}>
              删除
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default CreatePointer;
