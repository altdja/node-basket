import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './app.config';

import Home from './modules/home';

angular.module('app', [
  uiRouter,
  Home
])
.config(routing)
.run(['$rootScope', '$state', '$stateParams', (scope, $state, $stateParams) => {
  scope.$state = $state;
  scope.$stateParams = $stateParams
}]);
