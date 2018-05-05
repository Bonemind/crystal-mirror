import { h } from 'hyperapp';

const ConfirmModal = ({
   id,
   title = 'Confirm',
   text = 'Are you sure',
   confirmClass = 'btn btn-primary',
   confirmText = 'Save changes',
   confirmCallback = () => {},
   closeClass = 'btn btn-secondary',
   closeText = 'Close',
   closeCallback = () => {},
}) => (
   <div class="modal" tabindex="-1" role="dialog" id={id}>
      <div class="modal-dialog" role="document">
         <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title">{title}</h5>
               <button type="button" onclick={closeCallback} class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div class="modal-body">
               <p>{text}</p>
            </div>
            <div class="modal-footer">
               <button
                  type="button"
                  onclick={confirmCallback}
                  class={confirmClass}
                  data-dismiss="modal"
               >
                  {confirmText}
               </button>
               <button
                  type="button"
                  onclick={closeCallback}
                  class={closeClass}
                  data-dismiss="modal"
               >
                  {closeText}
               </button>
            </div>
         </div>
      </div>
   </div>
);

export default ConfirmModal;
