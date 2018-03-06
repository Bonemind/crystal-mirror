import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box, Divider, Flex, Text } from 'rebass';
import { logout } from '../stores/auth';
import { withRouter } from 'react-router';
import FA from 'react-fontawesome';

class Header extends Component {
   render() {
      const { username, logout, history } = this.props;
      const isAuthed = !!username;
      return (
         <Box width={1}>
            <Flex justifyContent="space-between">
               <Box width={1/2} style={{paddingTop: 12}}>
                  <NavLink activeStyle={{fontWeight: 'bold'}} exact={true} to="/">Home</NavLink>&nbsp;
                  <NavLink activeStyle={{fontWeight: 'bold'}} to="/about">About</NavLink>&nbsp;
                  <NavLink activeStyle={{fontWeight: 'bold'}} to="/counter">Counter</NavLink>&nbsp;
                  <NavLink activeStyle={{fontWeight: 'bold'}} to="/repositories">Repositories</NavLink>
               </Box>
               <Box width={1/3}>
                  <Text textAlign="right" style={{ padding: 12 }}>
                     { isAuthed ?
                        <span>{username}&nbsp;<FA name="sign-out" onClick={logout} /></span> :
                        <NavLink to="/login">Login</NavLink>
                        }
                  </Text>
               </Box>
            </Flex>
            <Divider />
         </Box>
      )
   }
}

const mapStateToProps = state => ({
   username: state.auth.username
});

const mapDispatchToProps = dispatch => bindActionCreators({
   logout
}, dispatch);

export default withRouter(connect(
   mapStateToProps,
   mapDispatchToProps
)(Header));
