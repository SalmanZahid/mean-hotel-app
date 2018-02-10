angular.module('meanhotel').factory('UserFactory', UserFactory);

function UserFactory($http){
    return {
        login: login,
        register:register
    };

    function login( username, password ) {
        var data = {
            username: username,
            password: password
        };

        return $http.post('/api/login', data).then(complete).catch(failed);
    }

    function register(username,password,name){
        var data = {
            username: username,
            password: password,
            name: name
        };
        
        return $http.post('/api/users/register', data).then(complete).catch(failed);
    }

    function complete(response) {
        return response;
    }

    function failed(error){
        return error;
    }

}