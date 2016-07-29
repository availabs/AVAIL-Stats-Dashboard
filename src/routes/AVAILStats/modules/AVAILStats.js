/* @flow */
import fetch from 'isomorphic-fetch'

// ------------------------------------
// Constants
// ------------------------------------

export const RECEIVE_AVAILSTATS_DATA = 'RECEIVE_AVAILSTATS_DATA'

export const loadStatsData = (interval) => {
  return (dispatch) => {
    console.log("loading")
    console.log('https://6u06hlzjn0.execute-api.us-east-1.amazonaws.com/dev/logins/'+interval)
    return fetch('https://6u06hlzjn0.execute-api.us-east-1.amazonaws.com/dev/logins/'+interval)
      .then(response => response.json())
      .then(json => dispatch(recieveStatsData(json,interval)))
  }
}

export function recieveStatsData (value,interval) {
  return {
    type: RECEIVE_AVAILSTATS_DATA,
    payload: [value,interval]
  }
}


export const actions = {
  loadStatsData,
  recieveStatsData
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_AVAILSTATS_DATA]: (state,action) => {
    var newState = Object.assign({},state);

    newState[action.payload[1]] = action.payload[0];

    return newState;
  }
}


// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};

export default function statsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
