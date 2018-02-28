import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { login } from '../modules/auth';

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
      console.log(this.state);
      return (
         <form onSubmit={this.handleSubmit}>
            <label>
               Name:
               <input type="text" value={this.state.username} onChange={(e) => this.handleChange(e, 'username')} />
            </label>
            <br />
            <label>
               Password:
               <input type="password" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')} />
            </label>
            <input type="submit" value="Submit" />
         </form>
      );
   }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
   login,
   changePage: () => push('/about-us')
}, dispatch);

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Login);
