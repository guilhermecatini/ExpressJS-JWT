'use strict'

angular.module('AppJwt').controller('jwtController', jwtController)

function jwtController($http) {
  var vm = this

  vm.user = {}
  vm.users = {}
  vm.myToken = ''
  vm.messageCreate = ''
  vm.messageRetrieve = ''

  vm.getToken = getToken
  function getToken() {
    $http({
      method: 'GET',
      url: '/api/users/getToken'
    })
      .then(function (ret) {
        if (ret.data.error === false) {
          vm.myToken = ret.data.token
        }
      })
  }

  vm.Create = Create
  function Create() {
    $http({
      method: 'POST',
      url: '/api/users/create',
      data: vm.user,
      headers: {
        'Authorization': vm.myToken
      }
    })
      .then(function (ret) {
        vm.messageCreate = 'User created! ' + JSON.stringify(ret.data)
      }, function (err) {
        vm.messageCreate = err.data
      })
  }

  vm.Retrieve = Retrieve
  function Retrieve() {
    $http({
      method: 'GET',
      url: '/api/users/retrieve',
      headers: {
        'Authorization': vm.myToken
      }
    })
      .then(function (ret) {
        vm.users = ret.data
        vm.messageRetrieve = 'Users have been listed!'
      }, function (err) {
        vm.users = {}
        vm.messageRetrieve = err.data
      })
  }


}