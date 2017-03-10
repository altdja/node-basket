import angular from 'angular';

import routing from './routes';
import HomeController from './controller';

export default angular.module('app.Homepage', [])
  .config(routing)
  .component('homepage', {
      template: require('./homepage.html'),
      controller: ['$scope', '$state', HomeController],
      controllerAs: '$ctrl'
  })
  .name;
