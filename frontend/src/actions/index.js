import auth from './auth';
import counter from './counter';
import repositories from './repositories';
import profile from './profile';
import users from './users';
import commandresults from './commandresults';
import { location } from "@hyperapp/router";

export default {
   auth,
   counter,
   repositories,
   users,
   commandresults,
   profile,
   location: location.actions,
};

