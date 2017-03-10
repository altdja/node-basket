function routing($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/home');
}

routing.$inject = ['$urlRouterProvider', '$locationProvider'];

export default routing;
