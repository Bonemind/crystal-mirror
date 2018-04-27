import { h } from 'hyperapp';
import $ from 'jquery';
import ConfirmModal from './ConfirmModal';
import client from '../client';

const createUserLine = (user, actions, userId) => {
   return (
      <tr>
         <ConfirmModal
            id={"deleteModal" + user.id}
            title="Remove user"
            text="Are you sure you want to remove this user?"
            confirmClass="btn btn-danger"
            confirmText="Delete"
            confirmCallback={() => actions.deleteUser(user)}
         />
         <td>{user.name}</td>
         <td>&nbsp;</td>
         { user.id == userId ?
            (<td>
               <i class="pointer fa fa-edit" onclick={() => actions.addWorkingCopy(user)} />
               <i class="pointer fa fa-times" onclick={() => $('#deleteModal' + user.id).modal()} />
            </td>) : <td>&nbsp;</td>}
      </tr>
   );
};

const createUserEditLine = (user, actions) => {
   return (
      <tr>
         <td>
            <input
               type="text"
               class="form-control"
               value={user.name}
               oninput={(e) => actions.setCopyValue({id: user.id, field: 'name', value: e.target.value})}
            />
         </td>
         <td>
            <input
               type="password"
               class="form-control"
               value={user.password}
               placeholder="password"
               oninput={(e) => actions.setCopyValue({id: user.id, field: 'password', value: e.target.value})}
            />
         </td>
         <td>
            <i class="pointer fa fa-check" onclick={() => actions.saveWorkingCopy(user.id)} />
            <i class="pointer fa fa-times" onclick={() => actions.removeWorkingCopy(user.id)} />
         </td>
      </tr>
   );
};


export default ({ users: state, auth: currentUser }, { users: actions }) => {
   return (
      <div class="table-responsive" oncreate={() => actions.loadUsers()}>
         <h2>Users</h2>
         <table class="table table-striped table-sm">
            <thead>
               <tr>
                  <th>Username</th>
                  <th>&nbsp;</th>
                  <th><i onclick={() => actions.addWorkingCopy()} class="pointer fa fa-plus"/></th>
               </tr>
            </thead>
            <tbody>
               { state.users.map(r => {
                  const workingCopy = state.workingCopies.filter(e => e.id == r.id);
                  return workingCopy.length > 0 ? createUserEditLine(workingCopy[0], actions) : createUserLine(r, actions, currentUser.userId);
               }
               )}
               { state.workingCopies.filter(r => (r.id + '').startsWith('new')).map(r => createUserEditLine(r, actions)) }
            </tbody>
         </table>
      </div>
   )
}
