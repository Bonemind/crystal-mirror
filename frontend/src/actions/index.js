import auth from './auth';
import counter from './counter';
import repositories from './repositories';
import profile from './profile';
import users from './users';
import { location } from "@hyperapp/router";

export default {
   auth,
   counter,
   repositories,
   users,
   profile,
   location: location.actions,
};

