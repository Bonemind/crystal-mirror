import auth from './auth';
import counter from './counter';
import repositories from './repositories';
import { location } from "@hyperapp/router";

export default {
   auth,
   counter,
   repositories,
   location: location.actions,
};
