import { h } from 'hyperapp';
import $ from 'jquery-slim';
import ConfirmModal from './ConfirmModal';

export default ({ profile: state }, { profile: actions }) => {
   const confirmRegenBody = (
      <p>
         Type in your password to confirm key regeneration.
         <br />
         <br />
         <input
            class="form-control"
            type="password"
            value={state.passwordConfirm}
            oninput={e => actions.updatePasswordConfirm(e.target.value)}
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
                     style={{ float: 'right', marginTop: '5px' }}
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
         <div class="row">
            <div class="card" style={{ minWidth: '100%' }}>
               <h5 class="card-header">
                  Change password
               </h5>
               <div class="card-body">
                  <div class="form-group">
                     <label for="currentPass">Current password</label>
                     <input
                        type="password"
                        id="currentPass"
                        class="form-control"
                        value={state.passwordChangeForm.currentPassword}
                        placeholder="Current password"
                        oninput={e => actions.updatePasswordChangeForm({
                           field: 'currentPassword',
                           value: e.target.value,
                        })
                        }
                     />
                  </div>
                  <div class="form-group">
                     <label for="newPass">New password</label>
                     <input
                        type="password"
                        id="newPassword"
                        class="form-control"
                        value={state.passwordChangeForm.newPassword}
                        placeholder="New password"
                        oninput={e => actions.updatePasswordChangeForm({ field: 'newPassword', value: e.target.value })}
                     />
                  </div>
                  <button onclick={() => actions.updatePassword()} class="btn btn-primary" type="button">Save</button>
               </div>
            </div>
         </div>
      </div>
   );
};
