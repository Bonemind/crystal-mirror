import { h } from 'hyperapp';
import range from 'lodash-es/range';

const PAGE_ENTRIES = 20;

const createResultCard = result => (
   <div class="card" style={{ minWidth: '100%' }}>
      <h5 class="card-header">
         { result.status === 0 ? 'Success' : 'Failure' }
         <span style={{ float: 'right' }}>{result.created_at}</span>
      </h5>
      <div class="card-body">
         <pre>{ result.output }</pre>
      </div>
   </div>
);

export default (match, { commandresults: state }, { commandresults: actions }) => {
   const currentCommandResult = state.results.get(match.params.id);
   const commandresults = currentCommandResult ? currentCommandResult.results : [];
   const currentPage = (currentCommandResult ? currentCommandResult.page : 1);
   const pageCount = Math.ceil((currentCommandResult ? currentCommandResult.total : PAGE_ENTRIES) / PAGE_ENTRIES);
   return (
      <div class="container-fluid" oncreate={() => actions.loadCommandResults({ id: match.params.id, page: 1 })}>
         <nav aria-label="Page navigation example">
            <ul class="pagination">
               <li class={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <a
                     onclick={
                        () => actions.loadCommandResults({
                           id: match.params.id,
                           page: +currentCommandResult.page - 1,
                        })
                     }
                     class="page-link" href="#"
                  >Previous</a>
               </li>
               { range(1, pageCount + 1).map(p => (
                  <li class={`page-item ${p === currentPage ? 'active' : ''}`}>
                     <a
                        onclick={() => actions.loadCommandResults({ id: match.params.id, page: p })}
                        class="page-link" href="#"
                     >{p}</a>
                  </li>
               ))}
               <li class={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
                  <a
                     onclick={
                        () => actions.loadCommandResults({
                           id: match.params.id,
                           page: +currentCommandResult.page + 1,
                        })
                     }
                     class="page-link" href="#"
                  >Next</a>
               </li>
            </ul>
         </nav>
         <div class="row">
            <h2>Results</h2>
         </div>
         <div class="row">
            {commandresults.map(e => createResultCard(e))}
         </div>
      </div>
   );
};
