import { location } from '@hyperapp/router'; // eslint-disable-line
import auth from './auth';
import commandresults from './commandresults';
import counter from './counter';
import profile from './profile';
import repositories from './repositories';
import users from './users';

export default {
   auth,
   counter,
   repositories,
   users,
   commandresults,
   profile,
   location: location.actions,
};

