import React, { Component, Fragment } from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadRepos, createRepo } from '../stores/repositories';
import { Input, Button, Label, Box, Card, Subhead } from 'rebass';

class RepositoryForm extends Component {
   constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
         from_url: '',
         to_url: ''
      };
   }

   handleChange(field, value) {
      const newState = {};
      newState[field] = value;
      this.setState(newState);
   }

   render() {
      const { saveCallback } = this.props;
      return (
         <Box>
            <Input
               value={this.state.from_url}
               placeHolder="From url" onChange={(e) => this.handleChange('from_url', e.target.value)}
            />
            <Input
               value={this.state.to_url}
               placeHolder="To url" onChange={(e) => this.handleChange('to_url', e.target.value)}
            />
            <Button onClick={() => saveCallback({to_url: this.state.to_url, from_url: this.state.from_url})}>
               Save
            </Button>
         </Box>
      )
   }
}

class RepositoryLine extends Component {
   render() {
      return (
         <Fragment>
            {JSON.stringify(this.props.children)}
         </Fragment>
      )
   }
}

class RepositoryPage extends Component {
   constructor(props) {
      super(props);
      props.loadRepos();
   }

   render() {
      const { username, createRepo, repositories } = this.props;
      return (
         <Fragment>
            <Box width={1/2} ml={"25%"}>
               <table style={{width: "100%"}}>
                  <thead>
                     <tr>
                        <td><Subhead>From</Subhead></td>
                        <td><Subhead>To</Subhead></td>
                        <td><Subhead>Poll rate</Subhead></td>
                        <td>&nbsp;</td>
                     </tr>
                  </thead>
                  <tbody>

                              <tr>
                                 <td>github.com/Bonemind/configs</td>
                                 <td>bitbucket.com/Bonemind/configs</td>
                                 <td>5</td>
                                 <td></td>
                              </tr>
                              <RepositoryLine>
                                 {repositories}
                              </RepositoryLine>
                  </tbody>
               </table>

               { JSON.stringify(this.props.repositories) }
            </Box>
            <Box width={1/3} ml={"33%"}>
               <RepositoryForm saveCallback={createRepo} />
            </Box>
         </Fragment>
      );
   }
}

const mapStateToProps = state => ({
   repositories: state.repositories.repositories
});

const mapDispatchToProps = dispatch => bindActionCreators({
   loadRepos,
   createRepo
}, dispatch);

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(RepositoryPage);
