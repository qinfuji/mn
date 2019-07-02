import React from 'react';
import {Form, Input, Button, Icon, Tooltip, Select} from 'antd';

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
    const {onPointer} = this.props;
  };

  save = () => {
    const {
      form: {validateFields},
      dispatch,
      pointer: {adCodeInfo},
    } = this.props;
    validateFields((error, values) => {
      if (error) return;
      const reqParams = {...values, ...adCodeInfo};
      console.log(reqParams);
    });
  };

  render() {
    const {
      form: {getFieldDecorator},
      pointer = {},
      onRelocation,
      onCreateFance,
      onRemoveFance,
    } = this.props;
    return (
      <div className="pointerCreate">
        <Form>
          <Form.Item label="类别">
            {getFieldDecorator('type', {
              initialValue: pointer && pointer.type ? pointer.type : '',
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
              initialValue: pointer && pointer.lnglat ? pointer.lnglat.join(',') : '',
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
            {getFieldDecorator('fance', {initialValue: pointer && pointer.fance ? pointer.fance.path.join(';') : ''})(
              <Input
                suffix={
                  pointer &&
                  pointer.fance && (
                    <Tooltip title="删除围栏">
                      <Icon
                        type="delete"
                        style={{color: 'rgba(0,0,0,.45)'}}
                        onClick={() => {
                          onRemoveFance && onRemoveFance(pointer.fance.id);
                        }}
                      />
                    </Tooltip>
                  )
                }
                addonAfter={
                  <Tooltip title="建立围栏">
                    <Icon type="table" onClick={() => onCreateFance(pointer.lnglat)} />
                  </Tooltip>
                }
              />,
            )}
          </Form.Item>
          <Form.Item label="标签(业态)">{getFieldDecorator('label', {})(<Input />)}</Form.Item>
        </Form>
        <div style={{marginTop: '40px', display: 'flex', justifyContent: 'flex-end'}}>
          <Button type="primary" onClick={this.save}>
            保存
          </Button>
          &nbsp;
          <Button type="primary" onClick={this.submit}>
            保存并提交
          </Button>
        </div>
      </div>
    );
  }
}

export default CreatePointer;
