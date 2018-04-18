import { h } from 'hyperapp';

/**
 * first object in the store is 'state' (an object - {})
 * second object in the store is 'actions' (an object - {})
 * here we destructure what is needed
 * 'num' from 'state' and 'add'/'sub' from 'actions'
 */
const createRepoLine = (repo) => {
   console.log('a', repo);
   return (
      <tr>
         <td>{repo.from_url}</td>
         <td>{repo.to_url}</td>
         <td>{repo.poll_interval}</td>
      </tr>
   );
};


export default ({ repositories: state }, { repositories: actions }) =>
   <div class="table-responsive" oncreate={() => actions.loadRepositories()}>
      <h2>Repositories</h2>
      <table class="table table-striped table-sm">
         <thead>
            <tr>
               <th>From</th>
               <th>To</th>
               <th>Poll Interval</th>
            </tr>
         </thead>
         <tbody>
            { state.repositories.map(r => createRepoLine(r)) }
         </tbody>
      </table>
   </div>;
