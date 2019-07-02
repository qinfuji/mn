import React from 'react';
import {Form, Input, Button, Icon, Tooltip} from 'antd';

const FormItem = Form.Item;

@Form.create()
class CreatePointer extends React.Component {
  onSubmit = (e) => {
    e.preventDefault();
    const {onPointer} = this.props;
  };

  render() {
    const {
      form: {getFieldDecorator},
      lnglat,
      fance,
      onRelocation,
      onCreateFance,
      onRemoveFance,
    } = this.props;

    return (
      <div className="pointerCreate">
        <Form onSubmit={this.onSubmit}>
          <Form.Item label="类别">{getFieldDecorator('type', {})(<Input />)}</Form.Item>
          <Form.Item label="名称">{getFieldDecorator('name', {})(<Input />)}</Form.Item>
          <Form.Item label="详细地址">{getFieldDecorator('address', {})(<Input />)}</Form.Item>
          <Form.Item label="经纬度">
            {getFieldDecorator('latlng', {
              initialValue: lnglat ? lnglat.join(',') : '',
            })(
              <Input
                addonAfter={
                  <Tooltip title="点击定位中心">
                    <Icon type="environment" onClick={() => onRelocation(lnglat)} />
                  </Tooltip>
                }
              />,
            )}
          </Form.Item>
          <Form.Item label="围栏">
            {getFieldDecorator('fance', {initialValue: fance ? fance.path.join(';') : ''})(
              <Input
                suffix={
                  fance && (
                    <Tooltip title="删除围栏">
                      <Icon
                        type="delete"
                        style={{color: 'rgba(0,0,0,.45)'}}
                        onClick={() => {
                          onRemoveFance && onRemoveFance(fance.id);
                        }}
                      />
                    </Tooltip>
                  )
                }
                addonAfter={
                  <Tooltip title="建立围栏">
                    <Icon type="table" onClick={() => onCreateFance(lnglat)} />
                  </Tooltip>
                }
              />,
            )}
          </Form.Item>
          <Form.Item label="标签(业态)">{getFieldDecorator('label', {})(<Input />)}</Form.Item>
        </Form>
        <div style={{marginTop: '40px', display: 'flex', justifyContent: 'flex-end'}}>
          <Button type="primary">保存</Button>&nbsp;
          <Button type="primary">保存并提交</Button>
        </div>
      </div>
    );
  }
}

export default CreatePointer;
