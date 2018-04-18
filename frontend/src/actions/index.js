import auth from './auth';
import counter from './counter';
import repositories from './repositories';
import user from './user';
import { location } from "@hyperapp/router";

export default {
   auth,
   counter,
   repositories,
   user,
   location: location.actions,
};
