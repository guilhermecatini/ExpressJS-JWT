'use strict'

angular.module('AppJwt', ['ngRoute'])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/jwt', {
        templateUrl: "./partials/jwt.html",
        controller: 'jwtController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: "/jwt"
      })
  })