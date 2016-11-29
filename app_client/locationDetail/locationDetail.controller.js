(function() {
  angular
    .module('loc8rApp')
    .controller('locationDetailCtrl', locationDetailCtrl);
    
  locationDetailCtrl.$inject = ['$routeParams', '$location','$modal','loc8rData', 'authentication'];
  function locationDetailCtrl($routeParams,$location,$modal, loc8rData,authentication) {
    var vm = this;
    vm.locationid = $routeParams.locationid; 
    
    // Create isLoggedIn method to get current visitor state
    vm.isLoggedIn = authentication.isLoggedIn();
    
    // Get current URL path of visitor
    vm.currentPath = $location.path();
    
    loc8rData.locationById(vm.locationid)
      .success(function(data) {
        vm.data = { location: data };
        vm.pageHeader = {
          title: vm.data.location.name
        };
      })
      .error(function(e) {
        console.log(e);
      });
      
    vm.popupReviewForm = function() {
      var modalInstance = $modal.open({
        templateUrl: '/reviewModal/reviewModal.view.html',
        controller: 'reviewModalCtrl as vm',
        resolve: {
          locationData: function() {
            return {
              locationid: vm.locationid,
              locationName: vm.data.location.name
            }
          }
        }
      });
      modalInstance.result.then(function(data) {
        vm.data.location.reviewList.push(data);
      });
    };
  }
})();