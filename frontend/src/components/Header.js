import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box, NavLink, Divider, Flex, Text } from 'rebass';

class Header extends Component {
   render() {
      const { username } = this.props;
      const isAuthed = !!username;
      return (
         <Box width={1}>
            <Flex justifyContent="space-between">
               <Box width={1/2}>
                  <NavLink><Link to="/">Home</Link></NavLink>
                  <NavLink><Link to="/about">About</Link></NavLink>
                  <NavLink><Link to="/counter">Counter</Link></NavLink>
                  <NavLink><Link to="/repositories">Repositories</Link></NavLink>
               </Box>
               <Box width={1/3}>
                  <Text textAlign="right" style={{ padding: 8 }}>
                     { isAuthed ? username : <NavLink><Link to="/login">Login</Link></NavLink> }
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
}, dispatch);

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Header);
