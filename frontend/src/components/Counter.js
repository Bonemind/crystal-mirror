import { h } from 'hyperapp';
import Description from './Description';

/**
 * first object in the store is 'state' (an object - {})
 * second object in the store is 'actions' (an object - {})
 * here we destructure what is needed
 * 'num' from 'state' and 'add'/'sub' from 'actions'
 */
export default ({ counter: state }, { counter: actions }) =>
  <div class="counter">
    <Description />
    <section>
      <button
        class="sub"
        onclick={actions.sub}
      >
        -
      </button>
      <h1 class="count">{state.num}</h1>
      <button
        class="add"
        onclick={actions.add}
      >
        +
      </button>
    </section>
  </div>;
