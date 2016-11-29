(function() {
  angular
    .module('loc8rApp')
    .service('authentication', authentication);
  
  authentication.$inject = ['$http','$window'];
  function authentication($http,$window) {
  
    var saveToken = function(token) {
      $window.localStorage['loc8r-token'] = token;
    };
    
    var getToken = function() {
      return $window.localStorage['loc8r-token'];
    };
    
    var register = function(user) {
      return $http.post('/api/register', user).success(function(data) {
        saveToken(data.token);
      });
    };
    
    var login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken(data.token);
      });
    };
    
    var logout = function() {
      $window.localStorage.removeItem('loc8r-token');
    };
    
    var isLoggedIn = function() {
      var token = getToken();
      
      if(token) {
        // if token exists get payload, decode it, and parse it to JSON
        var payload = JSON.parse(Base64.decode(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };
    
    var currentUser = function() {
      if(isLoggedIn()) {
        var token = getToken();
        // change $window.atob to Base64.decode for UTF-8
        var payload = JSON.parse(Base64.decode(token.split('.')[1]));
        return {
          email: payload.email,
          name: payload.name
        };
      }
    };

    return {
      saveToken: saveToken,
      getToken: getToken,
      register: register,
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      currentUser: currentUser
    };

  }
})();
