import { location } from '@hyperapp/router'; // eslint-disable-line
import auth from './auth';
import commandresults from './commandresults';
import profile from './profile';
import repositories from './repositories';
import users from './users';

export default {
   auth,
   commandresults,
   location: location.state,
   profile,
   repositories,
   users,
};
