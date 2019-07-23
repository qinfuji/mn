import React from 'react';
import {Table, Modal, Layout, Form, Input, Button} from 'antd';
import {fatch, create as createLabel, invalid, queryRootByLabel} from '../../services/categroyLabels';
const {Header, Content} = Layout;
const data = [];

@Form.create()
class CategroyLabels extends React.Component {
  state = {
    showCreateModal: false,
    parentCategroyLabel: null,
    categroyLabel: null,
    action: null,
    data: [],
    defaultExpandAllRows: [],
  };

  componentDidMount() {
    setTimeout(async () => {
      const response = await fatch();
      if (response) {
        const _data = response.data;
        _data.forEach((d) => {
          d.children = [];
        });
        this.setState({
          data: _data,
        });
      }
    }, 100);
  }

  handldOnExpand = (expanded, record) => {
    setTimeout(async () => {
      if (!record.loaded) {
        record.loaded = true;
        const response = await fatch(record.id);
        if (response) {
          const _data = response.data;
          if (_data && _data.length) {
            _data.forEach((d) => {
              d.children = [];
              d.parent = record;
            });
            record.children = record.children.concat(_data);
            this.setState({
              data: [].concat(this.state.data),
            });
          }
        }
      }
    }, 100);
  };

  showCreateModal = (record) => {
    const {form} = this.props;
    form.setFieldsValue({labelName: ''});
    this.setState({
      showCreateModal: true,
      parentCategroyLabel: record,
      action: 'create',
    });
  };

  showUpdateModal = (record) => {
    const {form} = this.props;
    form.setFieldsValue({labelName: record.label});
    this.setState({
      showCreateModal: true,
      parentCategroyLabel: null,
      categroyLabel: record,
      action: 'update',
    });
  };

  deleteLabel = (record) => {
    Modal.confirm({
      title: `您确定要删除<${record.label}>标签?`,
      onOk: async () => {
        const response = await invalid(record);
        const {data} = this.state;
        if (response) {
          if (!record.parent) {
            const newData = data.reduce((ret, d) => {
              if (d.id !== record.id) {
                ret.push(d);
              }
              return ret;
            }, []);
            this.setState({
              data: [].concat(newData),
            });
          } else {
            const idx = record.parent.children.indexOf(record);
            if (idx >= 0) {
              record.parent.children.splice(idx, 1);
            }
            this.setState({
              data: [].concat(data),
            });
          }
        }
      },
      onCancel() {},
    });
  };

  hideCreateModal = () => {
    const {form} = this.props;
    form.setFieldsValue({labelName: ''});
    this.setState({
      showCreateModal: false,
      parentCategroyLabel: null,
      categroyLabel: null,
      action: null,
    });
  };

  columns = [
    {
      title: '标签名称',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '操作',
      width: '50%',
      render: (text, record) => {
        return (
          <div id="btnbar">
            <Button
              size="small"
              onClick={() => {
                this.showCreateModal(record);
              }}
            >
              创建子标签
            </Button>
            <Button
              size="small"
              onClick={() => {
                this.showUpdateModal(record);
              }}
            >
              修改
            </Button>
            <Button
              size="small"
              onClick={() => {
                this.deleteLabel(record);
              }}
            >
              作废
            </Button>
          </div>
        );
      },
    },
  ];

  onSave = (isClose) => {
    const {parentCategroyLabel, categroyLabel, action, data, defaultExpandAllRows} = this.state;
    const {
      form: {validateFields, setFieldsValue},
    } = this.props;
    validateFields(['labelName'], async (error, values) => {
      if (error) return;
      let params = {
        label: values.labelName,
      };
      if (parentCategroyLabel && action === 'create') {
        params.parentId = parentCategroyLabel.id;
        params.children = [];
      } else if (action === 'update') {
        params.id = categroyLabel.id;
      }
      const response = await createLabel(params);
      if (response && action === 'create') {
        params.children = [];
        if (parentCategroyLabel) {
          params.id = response.data.id;
          params.parent = parentCategroyLabel;
          parentCategroyLabel.children.push(params);
        } else {
          data.push(params);
        }
      } else if (response && action === 'update') {
        categroyLabel.label = params.label;
      }
      let closeState = {};
      if (isClose === 'close') {
        closeState = {
          showCreateModal: false,
          parentCategroyLabel: null,
          categroyLabel: null,
          action: null,
        };
      }
      setFieldsValue({labelName: ''});
      if (response) {
        this.setState({
          data: [].concat(data),
          ...closeState,
        });
      }
    });
  };

  onSearch = async () => {
    setTimeout(async () => {
      const {form} = this.props;
      const rootParentName = form.getFieldValue('rootParentName');
      let response = null;
      if (rootParentName) {
        response = await queryRootByLabel(rootParentName);
      } else {
        response = await fetch();
      }
      if (response) {
        const _data = response.data;
        _data.forEach((d) => {
          d.children = [];
        });
        this.setState({
          data: _data,
        });
      }
    }, 100);
  };

  render() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {data, action} = this.state;
    return (
      <Layout style={{height: '100%'}}>
        <Header>
          <Form layout="inline">
            <Form.Item label="根标签名称">{getFieldDecorator('rootParentName', {})(<Input />)}</Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.onSearch}>
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  this.showCreateModal();
                }}
              >
                创建根标签
              </Button>
            </Form.Item>
          </Form>
        </Header>
        <Layout style={{width: '100%', height: '100%', backgroundColor: '#fff'}}>
          <Content>
            <div id="categroyLabelTable">
              <Table
                size="small"
                rowKey="id"
                bordered
                columns={this.columns}
                dataSource={data}
                onExpand={this.handldOnExpand}
              />
            </div>
          </Content>
        </Layout>
        <Modal
          maskClosable={false}
          title="创建班级"
          visible={this.state.showCreateModal}
          onCancel={this.hideCreateModal}
          footer={[
            <Button key="cancel" onClick={this.hideCreateModal}>
              取消
            </Button>,
            <Button key="save" type="primary" onClick={this.onSave.bind(this, 'close')}>
              {action === 'create' ? '创建' : '修改'}
            </Button>,
            action === 'create' ? (
              <Button key="saveContinue" type="primary" onClick={this.onSave.bind(this, 'continue')}>
                创建并继续
              </Button>
            ) : null,
          ]}
        >
          <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>
            {this.state.parentCategroyLabel && (
              <Form.Item label="父标签名称">{this.state.parentCategroyLabel.label}</Form.Item>
            )}
            <Form.Item label="标签名称">
              {getFieldDecorator('labelName', {
                initialValue: this.state.categroyLabel ? this.state.categroyLabel.label : '',
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    );
  }
}

export default CategroyLabels;
