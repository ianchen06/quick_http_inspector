import React from 'react'

import HttpItemContainer from '../containers/HttpItemContainer'

//import HttpItemList from './HttpItemList'

const state = {
    'httpitems': [
        {
            'requestId': 1,
            'request': {
                'url': 'https://ianchenhq.com',
                'method': "GET",
                'type': 'text/html'
            },
            'response': {
                'url': 'https://ianchenhq.com',
                'method': "GET",
                'type': 'text/html'
            }
        },
        {
            'requestId': 2,
            'request': {
                'url': 'https://ianchenhq.com',
                'method': "GET",
                'type': 'text/html'
            },
            'response': {
                'url': 'https://ianchenhq.com',
                'method': "GET",
                'type': 'text/html'
            }
        }, {
            'requestId': 3,
            'request': {
                'url': 'https://ianchenhq.com',
                'method': "GET",
                'type': 'text/html'
            },
            'response': {
                'url': 'https://ianchenhq.com',
                'method': "GET",
                'type': 'text/html'
            }
        }, {
            'requestId': 4,
            'request': {
                'url': 'https://ianchenhq.com',
                'method': "GET",
                'type': 'text/html'
            },
            'response': {
                'url': 'https://ianchenhq.com',
                'method': "GET",
                'type': 'text/html'
            }
        }
    ]
}

const App = () => (
    <div>
        <HttpItemContainer />
    </div>
)

export default App