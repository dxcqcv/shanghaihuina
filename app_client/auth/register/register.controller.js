(function() {

  angular
    .module('loc8rApp') 
    .controller('registerCtrl', registerCtrl);
  
  registerCtrl.$inject = ['$location', 'authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;
    
    vm.pageHeader = {
      title: '注册新用户'
    };
    
    // Instanticate credentials
    vm.credentials = {
      name: "",
      sex:"",
      email: "",
      birthday: "",
      phone: "",
      address: "",
      password: ""
    };
    
    // get page to return to from query string
    vm.returnPage = $location.search().page || '/';
    
    vm.onSubmit = function() {
      vm.formError = "";
      if(!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else {
        vm.doRegister();
      }
    };
    
    vm.doRegister = function() {
      vm.formError = "";
      // authentication return promises
      authentication
        .register(vm.credentials)
        .error(function(err) {
          vm.formError = err;
        })
        .then(function() {
          // clear query string
          $location.search('page', null);
          // redirect user
          $location.path(vm.returnPage);
        });
    };
    
  }
  
})();
