angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('selectStop', {
    url: '/stopSelect',
    templateUrl: 'templates/selectStop.html',
    controller: 'selectStopCtrl'
  })

  .state('selectLineProposalNextIterations', {
    url: '/lineSelect',
    templateUrl: 'templates/selectLineProposalNextIterations.html',
    controller: 'selectLineProposalNextIterationsCtrl'
  })

  .state('selectLineProposalNextIterations2', {
    url: '/busSelectLine',
    templateUrl: 'templates/selectLineProposalNextIterations2.html',
    controller: 'selectLineProposalNextIterations2Ctrl'
  })

  .state('sonnenstr', {
    url: '/stopDetail',
    templateUrl: 'templates/sonnenstr.html',
    controller: 'sonnenstrCtrl'
  })

  .state('homescreen', {
    url: '/home',
    templateUrl: 'templates/homescreen.html',
    controller: 'homescreenCtrl'
  })

  .state('busInformation', {
    url: '/busInfo',
    templateUrl: 'templates/busInformation.html',
    controller: 'busInformationCtrl'
  })

$urlRouterProvider.otherwise('/home')

  

});