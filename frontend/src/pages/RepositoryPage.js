import React, { Component, Fragment } from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadRepos, saveRepo, addEmpty, deleteRepo, syncRepo } from '../stores/repositories';
import { Input, Button, Label, Box, Card, Subhead, Modal, Heading, ButtonOutline, Row, Divider } from 'rebass';
import FA from 'react-fontawesome';

class DeleteModal extends Component {
   render() {
      const { repo, closeCallback, confirmCallback } = this.props;
      return (
         <Modal width={512}>
            <Box width={9/10} ml="5%">
               <Heading>Delete Repository</Heading>
               <Divider />
               <Row>
                  Really delete this repository? <br />
                  {repo.from_url} > {repo.to_url}
               </Row>
               <Divider />
               <Row>
                  <Box width={1/10} ml="60%">
                     <Button onClick={confirmCallback}>Confirm</Button>
                  </Box>
                  <Box width={1/10} ml="10%">
                     <ButtonOutline onClick={closeCallback}>Cancel</ButtonOutline>
                  </Box>
                  {"    "}
               </Row>
            </Box>
         </Modal>
      )
   }
}

class RepositoryLine extends Component {
   constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.renderRow = this.renderRow.bind(this);
      this.renderEditRow = this.renderEditRow.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.confirmDelete = this.confirmDelete.bind(this);
      this.save = this.save.bind(this);
      this.state = {
         repo: {...props.repo},
         edit: !!props.edit,
         removeModal: false
      };
   }

   closeModal() {
      this.setState({removeModal: false});
   }

   confirmDelete() {
      this.props.deleteRepo(this.state.repo);
      this.closeModal();
   }

   handleChange(field, newVal) {
      const val = {};
      val[field] = newVal.target.value;
      const newState = {...this.state.repo, ...val};
      this.setState({repo: newState});
   };

   save() {
      this.setState({edit: false});
      const { saveRepo } = this.props;
      saveRepo(this.state.repo);
   }

   renderRow() {
      const { from_url, to_url, poll_interval } = this.state.repo;
      const { syncRepo } = this.props;
      return (
         <Fragment>
            <td>{from_url}</td>
            <td>{to_url}</td>
            <td>{poll_interval}</td>
            <td>
               { this.state.repo.id &&
                     <Fragment><FA name="refresh" onClick={() => syncRepo(this.state.repo)} />&nbsp;</Fragment>
                     }
               <FA name="edit" onClick={() => this.setState({edit: true})} />&nbsp;
               <FA name="remove" onClick={() => this.setState({removeModal: true})} />
               { this.state.removeModal &&
                     <DeleteModal
                        closeCallback={this.closeModal}
                        confirmCallback={this.confirmDelete}
                        repo={this.state.repo}
                     />
               }
            </td>
         </Fragment>
      )
   }

   renderEditRow() {
      const { from_url, to_url, poll_interval, saveRepo } = this.state.repo;
      return (
         <Fragment>
            <td><Input value={from_url} onChange={(val) => this.handleChange('from_url', val)} /></td>
            <td><Input value={to_url} onChange={(val) => this.handleChange('to_url', val)} /></td>
            <td><Input value={poll_interval} onChange={(val) => this.handleChange('poll_interval', val)} /></td>
            <td>
               <FA name="check" onClick={this.save} />
            </td>
         </Fragment>
      );
   }

   render() {
      const { from_url, to_url, poll_interval } = this.state.repo;
      return (
         <tr>
            { this.state.edit ? this.renderEditRow() : this.renderRow() }
         </tr>
      )
   }
}

class RepositoryPage extends Component {
   constructor(props) {
      super(props);
      props.loadRepos();
   }

   render() {
      const {
         username,
         saveRepo,
         addEmpty,
         deleteRepo,
         syncRepo,
         repositories
      } = this.props;
      return (
         <Fragment>
            <Box width={3/4} ml={"12%"}>
               <table style={{width: "100%"}}>
                  <thead>
                     <tr>
                        <td><Subhead>From</Subhead></td>
                        <td><Subhead>To</Subhead></td>
                        <td><Subhead>Poll rate</Subhead></td>
                        <td><FA name="plus" onClick={addEmpty} /></td>
                     </tr>
                  </thead>
                  <tbody>
                     {repositories && repositories.map((repo, index) =>
                        <RepositoryLine
                           saveRepo={saveRepo}
                           deleteRepo={deleteRepo}
                           key={repo.id || `new${index}`}
                           repo={repo} edit={!repo.id}
                           syncRepo={syncRepo}
                        />
                     )}
                  </tbody>
               </table>
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
   saveRepo,
   deleteRepo,
   syncRepo,
   addEmpty
}, dispatch);

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(RepositoryPage);
