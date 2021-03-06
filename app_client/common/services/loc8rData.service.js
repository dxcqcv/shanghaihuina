(function(){
  angular
    .module('loc8rApp')
    .service('loc8rData', loc8rData);

  loc8rData.$inject = ['$http', 'authentication'];
  function loc8rData($http, authentication) {
    var locationByCoords = function(lat, lng) {
      //return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=2000');
      return $http.get('/api/locations?lng=-0.9690884&lat=51.455041&maxDistance=2000');
    };
    var locationById = function(locationid) {
      return $http.get('/api/locations/' + locationid);
    };
    var addReviewById = function(locationid, data) {
      return $http.post('/api/locations/' + locationid + '/reviews', data, {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      });
    };
    return {
      locationByCoords: locationByCoords,
      locationById: locationById,
      addReviewById: addReviewById
    }
  }
})();