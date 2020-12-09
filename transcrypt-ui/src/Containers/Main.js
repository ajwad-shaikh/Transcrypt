import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import MainNav from './MainNav';
import Query from './Query';
import QueryAll from './QueryAll';
import Create from './Create';
import Verification from './Verification';



class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      page: 0
    }
  }

  selectPageHandler = (value) => {
    this.setState({
      ...this.state,
      page: value.value
    })
  }

  render() {
    
    return (
          <Paper classes={{root: "Page-container"}}>
            <MainNav selectPage={this.selectPageHandler}/>
            
              {this.state.page === 0 ? <Query switchFeedHandler={this.props.switchFeedHandler} socket={this.props.socket} connected={this.props.connected}/> : null}
              {this.state.page === 1 ? <QueryAll switchFeedHandler={this.props.switchFeedHandler} socket={this.props.socket} connected={this.props.connected}/> : null}
              {this.state.page === 2 ? <Create switchFeedHandler={this.props.switchFeedHandler} socket={this.props.socket} connected={this.props.connected}/> : null}
              {this.state.page === 3 ? <Verification switchFeedHandler={this.props.switchFeedHandler} socket={this.props.socket} connected={this.props.connected}/> : null}
          </ Paper>
    );
  }
}

export default Main;


