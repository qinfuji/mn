import React from 'react';
import {List, Pagination, Spin} from 'antd';

class SearchResultList extends React.Component {
  componentWillUnmount() {
    console.log('SearchResultList componentWillUnmount');
  }

  render() {
    const {
      poiList: {pois, count, pageIndex, pageSize},
      onItemSelected,
      onPageChange,
    } = this.props;
    return (
      <div className="" style={{width: '100%'}}>
        <List
          dataSource={pois}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                style={{margin: '0 10px', cursor: 'pointer'}}
                title={
                  <span
                    onClick={() => {
                      onItemSelected && onItemSelected(item);
                    }}
                  >
                    {item.name}
                  </span>
                }
                description={`地址：${item.address}`}
              />
            </List.Item>
          )}
        ></List>
        {pois && pois.length && <Pagination size="small" onChange={onPageChange} current={pageIndex} total={count} />}
      </div>
    );
  }
}

export default SearchResultList;
