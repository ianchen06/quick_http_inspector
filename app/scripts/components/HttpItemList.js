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

const style = {
    pre: {
        whiteSpace: 'pre-wrap',       /* Since CSS 2.1 */
        wordWrap: 'break-word'       /* Internet Explorer 5.5+ */
    }
}

const HttpItemList = (props) => {
    const dataSource = props.httpitems.map(record => ({request: record.request, key: record.requestId, response: record.response}))
    
    const genFilter = (col) => {
        const filter = dataSource.filter(row => row[col[0]])
                                .map(row => row[col[0]][col[1]])
                                .reduce((acc, cur)=>{
                                if (acc.indexOf(cur) == -1) {
                                    return acc.concat(cur)
                                } else {
                                    return acc
                                }
                                },[])
                                .map(row => {
                                    if (!row) {
                                        return {'text': '', 'value': ''}
                                    } else {
                                        return {'text': row, 'value': row}
                                    }
                                })
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
            filters: genFilter(['response', 'mimeType']),
            onFilter: (value, record) => {
                if (record.response.mimeType == null) {
                    return false
                } else {
                    return record.response.mimeType.indexOf(value) === 0
                    
                }
            },
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
            render: (text, record) => {
                //console.log(text,record)

                // const requestHeaders = Object.keys(record.response.requestHeaders)
                // .filter(key => !key.startsWith(":"))
                // .reduce((obj, key) => {
                //   obj[key] = raw[key];
                //   return obj;
                // }, {});
                return (
                <span>
                    <a href="#" onClick={() => {
                          const _window = window.open('about:blank','_blank',`width=${Math.round(window.screen.availWidth/3)},height=${window.screen.availHeight - 420}`)
                          _window.document.write(` 
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
    <pre>
import requests
import json

url = "${record.request.url}"
data = ${record.request.pyPostData ? record.request.pyPostData : ''}
headers = json.loads(r'''${record.response.requestHeaders ? JSON.stringify(record.response.cleanRequestHeaders,null,4) : JSON.stringify(record.request.headers,null,4)}''')

resp = requests.${record.request.method.toLowerCase()}(url, data=data, headers=headers)
    </pre>
</body>
</html>`) 
                        }}>匯出</a>
                    {/* <span className="ant-divider" />
                    <a href="#" className="ant-dropdown-link">
                        More actions <Icon type="down" />
                    </a> */}
                </span>
                )
            },
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
                       <div>
                        <pre style={style.pre}>
                        {JSON.stringify(resp, null, 4)}
                        </pre>
                       </div>
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