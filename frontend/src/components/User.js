import { h } from 'hyperapp';
import $ from 'jquery';
import ConfirmModal from './ConfirmModal';

export default ({ user: state }, { user: actions }) => {
   const confirmRegenBody = (
      <p>
         Type in your password to confirm key regeneration.
         <br />
         <br />
         <input
            class="form-control"
            type="password"
            value={state.passwordConfirm}
            oninput={(e) => actions.updatePasswordConfirm(e.target.value)}
         />
      </p>
   );
   return (
      <div class="container" oncreate={() => actions.load()}>
         <ConfirmModal
            id="sshRegen"
            title="Regenerate ssh key"
            text={confirmRegenBody}
            confirmClass="btn btn-danger"
            confirmText="Generate key"
            confirmCallback={() => actions.regenSshKey()}
         />
         <div class="row">
            <h2>User</h2>
         </div>
         <div class="row">
            <div class="card" style={{ minWidth: '100%' }}>
               <h5 class="card-header">
                  Public key
                  <i
                     style={{float: 'right', marginTop: '5px'}}
                     class="pointer fa fa-recycle"
                     title="Generate new"
                     onclick={() => $('#sshRegen').modal()}
                  />
               </h5>
               <div class="card-body">
                  { state.sshKey ? state.sshKey : 'No key found.' }
               </div>
            </div>
         </div>
      </div>
   )
}
