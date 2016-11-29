(function(){
  angular
    .module('loc8rApp')
    .controller('homeCtrl',homeCtrl);
    
  homeCtrl.$inject = ['$scope','loc8rData', 'geolocation'];
  function homeCtrl($scope, loc8rData, geolocation) {
    // Nasty IE9 redirect hack (filckering)
    if(window.location.pathname !== '/') {
      window.location.href = '/#' + window.location.pathname;
    }
    var vm = this;
    vm.pageHeader = {
      title: '上海纳纳',
      strapline: '液压件销售网站'
    };
    vm.sidebar = {
      content: '公司地址：上海市宝山区共康路792号\n公司电话：021-66690503 66695503\n黎 明 13916054281'
    };
    vm.message = 'Checking your location';
    vm.getData = function(position) {
      var lat = position.coords.latitude,
        lng = position.coords.longitude;
      vm.message = 'Searching for nearby places';
      loc8rData.locationByCoords(lat, lng) 
        .success(function(data) {
          vm.message = data.length > 0 ? '' : 'No locations found nearby';
          vm.data = {locations: data}; 
        })
        .error(function(e) {
          vm.message = "Sorry, something's gone wrong";
        });
    };
    
    vm.showError = function(error) {
      $scope.$apply(function(){
        vm.message = error.message;
      });
    };
    
    vm.noGeo = function() {
      $scope.$apply(function() {
        $scope.message = "Geolocation is not supported by this browser.";
      });
    };
    
    //geolocation.getPosition(vm.getData, vm.showError, vm.noGeo);
    loc8rData.locationByCoords() 
        .success(function(data) {
          vm.message = data.length > 0 ? '' : 'No locations found nearby';
          vm.data = {locations: data}; 
        })
        .error(function(e) {
          vm.message = "Sorry, something's gone wrong";
        });
  }
})();