import { h } from 'hyperapp';
import $ from 'jquery-slim';
import ConfirmModal from './ConfirmModal';

const createUserLine = (user, actions, currentUser) => (
   <tr>
      <td>{user.name}</td>
      <td>&nbsp;</td>
      <td><i class={`fa fa-${user.is_admin ? 'check' : 'times'}`} /></td>
      <td>
      <ConfirmModal
         id={`deleteModal${user.id}`}
         title="Remove user"
         text="Are you sure you want to remove this user?"
         confirmClass="btn btn-danger"
         confirmText="Delete"
         confirmCallback={() => actions.deleteUser(user)}
      />
      { currentUser.isAdmin &&
         (<div>
            <i class="pointer fa fa-edit" onclick={() => actions.addWorkingCopy(user)} />
            <i class="pointer fa fa-trash" onclick={() => $(`#deleteModal${user.id}`).modal()} />
         </div>)}
      </td>
   </tr>
);

const createUserEditLine = (user, actions) => (
   <tr>
      <td>
         <input
            type="text"
            class="form-control"
            value={user.name}
            oninput={e => actions.setCopyValue({ id: user.id, field: 'name', value: e.target.value })}
         />
      </td>
      <td>
         <input
            type="password"
            class="form-control"
            value={user.password}
            placeholder="password"
            oninput={e => actions.setCopyValue({ id: user.id, field: 'password', value: e.target.value })}
         />
      </td>
      <td>
         <div class="form-check form-check-inline">
            <input
               id="adminCheckbox"
               type="checkbox"
               class="form-check-input"
               checked={user.is_admin}
               onchange={e => actions.setCopyValue({ id: user.id, field: 'is_admin', value: e.target.checked })}
            />
         </div>
      </td>
      <td>
         <i class="pointer fa fa-check" onclick={() => actions.saveWorkingCopy(user.id)} />
         <i class="pointer fa fa-times" onclick={() => actions.removeWorkingCopy(user.id)} />
      </td>
   </tr>
);


export default ({ users: state, auth: currentUser }, { users: actions }) => (
   <div class="table-responsive" oncreate={() => actions.loadUsers()}>
      <h2>Users</h2>
      <table class="table table-striped table-sm">
         <thead>
            <tr>
               <th>Username</th>
               <th>&nbsp;</th>
               <th>Admin</th>
               <th>
                  { currentUser.isAdmin &&
                        (<i onclick={() => actions.addWorkingCopy()} class="pointer fa fa-plus"/>)
                  }
               </th>
            </tr>
         </thead>
         <tbody>
            { state.users.map((r) => {
               const workingCopy = state.workingCopies.filter(e => e.id === r.id);
               return workingCopy.length > 0 ?
                  createUserEditLine(workingCopy[0], actions) :
                  createUserLine(r, actions, currentUser);
            })}
            { state.workingCopies.filter(r => (`${r.id}`).startsWith('new')).map(r => createUserEditLine(r, actions)) }
         </tbody>
      </table>
   </div>
);
