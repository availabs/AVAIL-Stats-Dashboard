import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'

import classes from './AVAILStats.scss'

export class AVAILStats extends React.Component<void, Props, void> {

  render(){
    if(Object.keys(this.props.AVAILStats).length == 0){
      console.log("empty")
      this.props.loadStatsData()
      return <span />
    }
    console.log(this.props)

    var users = Object.keys(this.props.AVAILStats.AVAILStats[0]).map(userName => {
      return (<tr><td>{userName}</td><td>{this.props.AVAILStats.AVAILStats[0][userName]}</td></tr>)
    })

    var displayInfo = (
      <table className='table table-hover' style={{textAlign:"left"}}>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Number of Logins</th>
          </tr>
          </thead>
        <tbody>
          {users}
        </tbody>
      </table>)



    return (
      <div>
        <div className={'col-xs-8 ' + classes['tableDiv']}>
          {displayInfo}
        </div>
      </div>
      )
  }
}

AVAILStats.propTypes = {
  loadStatsData: React.PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({

})

export default connect((mapStateToProps), {

})(AVAILStats)
