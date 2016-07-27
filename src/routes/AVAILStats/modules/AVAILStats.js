/* @flow */
import fetch from 'isomorphic-fetch'

// ------------------------------------
// Constants
// ------------------------------------

export const RECEIVE_AVAILSTATS_DATA = 'RECEIVE_AVAILSTATS_DATA'

export const loadStatsData = () => {
  return (dispatch) => {
    console.log("loading")
    return fetch('https://6u06hlzjn0.execute-api.us-east-1.amazonaws.com/dev/function1')
      .then(response => response.json())
      .then(json => dispatch(recieveStatsData(json)))
  }
}

export function recieveStatsData (value) {
  return {
    type: RECEIVE_AVAILSTATS_DATA,
    payload: value
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

    console.log(action.payload)
    newState.AVAILStats = action.payload;

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
