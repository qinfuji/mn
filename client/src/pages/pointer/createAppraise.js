import React from 'react';
import {Form, Input, Button} from 'antd';

const FormItem = Form.Item;

@Form.create()
class CreateAppraise extends React.Component {
  onSubmit = (e) => {
    e.preventDefault();
    const {onPointer} = this.props;
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="pointerCreate">
        <Form onSubmit={this.onSubmit}>
          <Form.Item label="类别">{getFieldDecorator('type', {})(<Input />)}</Form.Item>
          <Form.Item label="名称">{getFieldDecorator('name', {})(<Input />)}</Form.Item>
          <Form.Item label="详细地址">{getFieldDecorator('address', {})(<Input />)}</Form.Item>
          <Form.Item label="经纬度">{getFieldDecorator('latlng', {})(<Input />)}</Form.Item>
          <Form.Item label="围栏">{getFieldDecorator('fance', {})(<Input />)}</Form.Item>
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

export default CreateAppraise;
