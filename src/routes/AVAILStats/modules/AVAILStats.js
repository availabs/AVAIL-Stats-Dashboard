/* @flow */
import fetch from 'isomorphic-fetch'

// ------------------------------------
// Constants
// ------------------------------------

export const RECIEVE_LOGINS_DATA = 'RECIEVE_LOGINS_DATA'
export const RECIEVE_USERS_DATA = 'RECIEVE_USERS_DATA'


export const loadLoginsData = (interval) => {
  return (dispatch) => {
    console.log("loading",('https://6u06hlzjn0.execute-api.us-east-1.amazonaws.com/dev/logins/'+interval))
    return fetch('https://6u06hlzjn0.execute-api.us-east-1.amazonaws.com/dev/logins/'+interval)
      .then(response => response.json())
      .then(json => dispatch(recieveLoginsData(json,interval)))
  }
}

export function recieveLoginsData (value,interval) {
  return {
    type: RECIEVE_LOGINS_DATA,
    payload: [value,interval]
  }
}

export const loadUsersData = (lineLength, timeLength) => {
  return (dispatch) => {
    console.log("loading",('https://6u06hlzjn0.execute-api.us-east-1.amazonaws.com/dev/users/line/'+lineLength+'/time/'+timeLength))
    return fetch('https://6u06hlzjn0.execute-api.us-east-1.amazonaws.com/dev/users/line/'+lineLength+'/time/'+timeLength)
      .then(response => response.json())
      .then(json => dispatch(recieveUsersData(json,lineLength,timeLength)))
  }
}

export function recieveUsersData (value,lineLength,timeLength) {
  return {
    type: RECIEVE_USERS_DATA,
    payload: [value,lineLength,timeLength]
  }
}


export const actions = {
  loadLoginsData,
  recieveLoginsData,
  loadUsersData,
  recieveUsersData  
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECIEVE_LOGINS_DATA]: (state,action) => {
    var newState = Object.assign({},state);

    newState.logins[action.payload[1]] = action.payload[0];

    return newState;
  },
  [RECIEVE_USERS_DATA]: (state,action) => {
    var newState = Object.assign({},state);

    var data = action.payload[0];
    var lineLength = action.payload[1];
    var timeLength = action.payload[2];
    console.log(newState.users)
    if(!newState.users[timeLength]){
      newState.users[timeLength] = {}
    }

    newState.users[timeLength][lineLength] = data

    return newState;
  }
}


// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {logins:{},users:{}};

export default function statsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
