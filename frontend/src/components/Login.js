import { h } from 'hyperapp';
import Description from './Description';

/**
 * first object in the store is 'state' (an object - {})
 * second object in the store is 'actions' (an object - {})
 * here we destructure what is needed
 * 'num' from 'state' and 'add'/'sub' from 'actions'
 */

export default ({ auth: state }, { auth: actions }) =>
  <div class="counter">
    <Description />
    <section>
       <input type="text" value={state.loginForm.username} oninput={(e) => actions.loginForm.setUsername(e.target.value)} />
       <input type="text" value={state.loginForm.password} oninput={(e) => actions.loginForm.setPassword(e.target.value)} />
       <button type="submit" onclick={actions.login}>Submit</button>
       <button onclick={() => console.log(state)}>Log</button>
    </section>
  </div>;
