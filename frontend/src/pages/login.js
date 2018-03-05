import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { login } from '../stores/auth';
import { Input, Button, Label, Box } from 'rebass';

class Login extends Component {
   constructor(props) {
      super(props);
      this.state = {
         username: '',
         password: ''
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }

   handleChange(e, field) {
      const newState = {};
      newState[field] = e.target.value;
      this.setState(newState);
   }

   handleSubmit(e) {
      e.preventDefault();
      this.props.login(this.state.username, this.state.password);
   }

   render() {
      const { username } = this.props;
      return (
         <Box width={1/3} ml={"33%"}>
            <form onSubmit={this.handleSubmit}>
               <Label>
                  Name:
               </Label>
               <Input type="text" value={this.state.username} onChange={(e) => this.handleChange(e, 'username')} />
               <br />
               <Label>
                  Password:
               </Label>
               <Input type="password" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')} />
               <Button type="submit">Submit</Button>
            </form>
         </Box>
      );
   }
}

const mapStateToProps = state => ({
   username: state.auth.username
});

const mapDispatchToProps = dispatch => bindActionCreators({
   login,
   changePage: () => push('/about-us')
}, dispatch);

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Login);
