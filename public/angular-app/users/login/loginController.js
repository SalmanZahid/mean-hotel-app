angular.module('meanhotel').controller("LoginController", loginController);

function loginController(AuthFactory, UserFactory, $location, $window){
    vm = this;

    vm.isLoggedIn = function() {
        return AuthFactory.auth.isLoggedIn;
    }

    vm.Login = function() {
        console.log(vm.username, vm.password);
        if(vm.username && vm.password){
            UserFactory.login(vm.username, vm.password)
                            .then(response => {
                                var token = response.data;
                                $window.sessionStorage.token = token,
                                AuthFactory.auth.isLoggedIn = true,
                                $location.path('/');
                });
        }
    }

    vm.Logout= function(){
        console.log("HERE LOGOUT");
        delete $window.sessionStorage.token;
        AuthFactory.auth.isLoggedIn = false;
        $location.path('/');
    }

    vm.isActiveTab = function(url) {
        var currentPath = $location.path().split('/')[1];
        return url === currentPath ? 'active' : '';
    }
}