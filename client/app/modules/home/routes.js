function routes($stateProvider) {
    $stateProvider
        .state('homepage', {
            url: '/',
            template: '<homepage></homepage>'
        });
}
routes.$inject = ['$stateProvider'];

export default routes;
