import { h } from 'hyperapp';
import $ from 'jquery';
import { location } from "@hyperapp/router"
import ConfirmModal from './ConfirmModal';
import client from '../client';

const createRepoLine = (repo, actions) => {
   return (
      <tr>
         <ConfirmModal
            id={"deleteModal" + repo.id}
            title="Remove repository"
            text="Are you sure you want to remove this repository?"
            confirmClass="btn btn-danger"
            confirmText="Delete"
            confirmCallback={() => actions.deleteRepo(repo)}
         />
         <td>
            <i
               onclick={() => location.actions.go(`/repositories/${repo.id}/results`)}
               class={`pointer fa fa-thumbs-o-${(repo.last_result && repo.last_result.status) == 0 ? 'up' : 'down'}`}/>

         </td>
         <td>{repo.from_url}</td>
         <td>{repo.to_url}</td>
         <td>{repo.poll_interval}</td>
         <td>
            <i class="pointer fa fa-edit" onclick={() => actions.addWorkingCopy(repo)} />
            <i class="pointer fa fa-refresh" onclick={() => actions.forceSync(repo)} />
            <i class="pointer fa fa-trash" onclick={() => $('#deleteModal' + repo.id).modal()} />
         </td>
      </tr>
   );
};

const createRepoEditLine = (repo, actions) => {
   return (
      <tr>
         <td>&nbsp;</td>
         <td>
            <input
               type="text"
               class="form-control"
               value={repo.from_url}
               oninput={(e) => actions.setCopyValue({id: repo.id, field: 'from_url', value: e.target.value})}
            />
         </td>
         <td>
            <input
               type="text"
               class="form-control"
               value={repo.to_url}
               oninput={(e) => actions.setCopyValue({id: repo.id, field: 'to_url', value: e.target.value})}
            />
         </td>
         <td>
            <input
               type="number"
               class="form-control"
               value={repo.poll_interval}
               oninput={(e) => actions.setCopyValue({id: repo.id, field: 'poll_interval', value: e.target.value})}
            />
         </td>
         <td>
            <i class="pointer fa fa-check" onclick={() => actions.saveWorkingCopy(repo.id)} />
            <i class="pointer fa fa-times" onclick={() => actions.removeWorkingCopy(repo.id)} />
         </td>
      </tr>
   );
};


export default ({ repositories: state }, { repositories: actions }) => {
   return (
      <div class="table-responsive" oncreate={() => actions.loadRepositories()}>
         <h2>Repositories</h2>
         <table class="table table-striped table-sm">
            <thead>
               <tr>
                  <th>&nbsp;</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Poll Interval</th>
                  <th><i onclick={() => actions.addWorkingCopy()} class="pointer fa fa-plus"/>&nbsp;</th>
               </tr>
            </thead>
            <tbody>
               { state.repositories.map(r => {
                  const workingCopy = state.workingCopies.filter(e => e.id == r.id);
                  return workingCopy.length > 0 ? createRepoEditLine(workingCopy[0], actions) : createRepoLine(r, actions);
               }
               )}
               { state.workingCopies.filter(r => (r.id + '').startsWith('new')).map(r => createRepoEditLine(r, actions)) }
            </tbody>
         </table>
      </div>
   )
}
