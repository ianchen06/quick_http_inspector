import React from 'react'

import { Table, Icon } from 'antd';

const columns = [{
    title: 'Method',
    dataIndex: 'request.method',
    key: 'request.method'
}, {
    title: 'Type',
    dataIndex: 'response.mimeType',
    key: 'response.mimeType',
}, {
    title: 'URL',
    dataIndex: 'request.url',
    key: 'request.url',
    render: text => <a href={text}>
        {
          (() => {
              if (text.length > 130) {
                  return text.slice(0,130) + '...'
              } else {
                  return text
              }
          })()
        }
        </a>,
}, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
        <span>
            <a href="#">Action 一 {record.name}</a>
            <span className="ant-divider" />
            <a href="#">匯出</a>
            <span className="ant-divider" />
            <a href="#" className="ant-dropdown-link">
                More actions <Icon type="down" />
            </a>
        </span>
    ),
}];

const HttpItemList = (props) => {
    const dataSource = props.httpitems.map(record => ({request: record.request, key: record.requestId, response: record.response}))
    
    const genFilter = (col) => {
        const filter = dataSource.map(row => row[col[0]][col[1]])
                                .reduce((acc, cur)=>{
                                if (acc.indexOf(cur) == -1) {
                                    return acc.concat(cur)
                                } else {
                                    return acc
                                }
                                },[])
                                .map(row => ({'text': row, 'value': row}))
        console.log(filter)
        return filter
    }

    const genColumns = () => {
        return [{
            title: 'Method',
            dataIndex: 'request.method',
            key: 'request.method',
            filters: genFilter(['request', 'method']),
            onFilter: (value, record) => record.request.method.indexOf(value) === 0,
        }, {
            title: 'Type',
            dataIndex: 'response.mimeType',
            key: 'response.mimeType',
        }, {
            title: 'URL',
            dataIndex: 'request.url',
            key: 'request.url',
            render: text => <a href={text}>
                {
                  (() => {
                      if (text.length > 130) {
                          return text.slice(0,130) + '...'
                      } else {
                          return text
                      }
                  })()
                }
                </a>,
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href="#">Action 一 {record.name}</a>
                    <span className="ant-divider" />
                    <a href="#">匯出</a>
                    <span className="ant-divider" />
                    <a href="#" className="ant-dropdown-link">
                        More actions <Icon type="down" />
                    </a>
                </span>
            ),
        }]
    }

    return (
        <Table columns={genColumns()} 
               locale={{
                    filterConfirm: 'Ok',
                    filterReset: 'Reset',
                    emptyText: '目前沒有資料，請重新整理欲debug之頁面' }}
               expandedRowRender={(record) => {
                   const resp = dataSource.filter(rec=>rec.key == record.key)
                   return (
                       <pre>{JSON.stringify(resp, null, 4)}</pre>
                   )
               }}
               dataSource={dataSource} 
               pagination={
                   {
                       defaultPageSize: 15
                   }
               }
        />
    )
}
export default HttpItemList