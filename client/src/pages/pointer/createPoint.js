import React from 'react';
import {Form, Input, Button, Icon, Tooltip, Select, Modal, TreeSelect} from 'antd';

import {Constant as PointerAddressConstant} from '../../models/pointerAddress';
import {fatchAll} from '../../services/categroyLabels';

const FormItem = Form.Item;
const Option = Select.Option;
const {confirm} = Modal;

@Form.create({
  mapPropsToFields(props) {
    return {
      lnglat: props.lnglat,
    };
  },

  onValuesChange(props, values) {
    if (values['labels']) {
      values['labels'] = values['labels'].join(',');
    }
    console.log(values);
    props.onChange(values);
  },
})
class CreatePointer extends React.Component {
  state = {
    treeData: [],
  };

  componentDidMount() {
    setTimeout(async () => {
      const data = await fatchAll();
      this.setState({
        treeData: data,
      });
    }, 100);
  }

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
  onDelete = () => {
    const {onDelete, pointer} = this.props;
    confirm({
      title: '你确认要删除点址信息?',
      onOk() {
        if (onDelete) {
          onDelete(pointer);
        }
      },
      onCancel() {},
    });
  };

  getNewTreeData(treeData, currentId, child) {
    const loop = (data) => {
      if (!data) return;
      data.forEach((item) => {
        if (currentId === item.id) {
          item.children = child;
        } else {
          loop(item.children);
        }
      });
    };
    loop(treeData);
    return treeData;
  }

  onChange = (value) => {
    console.log('onChange ', value);
    this.setState({value});
  };

  render() {
    const {
      form: {getFieldDecorator},
      pointer = {},
      onRelocation,
      onCreateFence,
      onRemoveFence,
      onBack,
    } = this.props;
    console.log(pointer);
    return (
      <div className="pointerCreate">
        <Form>
          <Form.Item label="类别">
            {getFieldDecorator('type', {
              initialValue: pointer && pointer.type ? pointer.type : '',
              rules: [{required: true, message: '请选择'}],
            })(
              <Select placeholder="请选择">
                {Object.keys(PointerAddressConstant.typeLabel).map((key) => {
                  return (
                    <Option key={key} value={key}>
                      {PointerAddressConstant.typeLabel[key]}
                    </Option>
                  );
                })}
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
              initialValue: pointer && pointer.labels ? pointer.labels.split(',') : [],
              rules: [{required: true, message: '请填写'}],
            })(
              <TreeSelect
                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                placeholder="请选择"
                allowClear
                multiple
                treeData={this.state.treeData}
              ></TreeSelect>,
            )}
          </Form.Item>
        </Form>
        <div id="btnbar" style={{marginTop: '20px'}}>
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
              <Button size="small" type="primary" onClick={this.submit}>
                保存并提交
              </Button>
            </React.Fragment>
          )}
          {pointer && pointer.id && (
            <Button size="small" type="primary" onClick={this.onDelete}>
              删除
            </Button>
          )}
          <Button size="small" type="primary" onClick={onBack}>
            返回列表
          </Button>
        </div>
      </div>
    );
  }
}

export default CreatePointer;
