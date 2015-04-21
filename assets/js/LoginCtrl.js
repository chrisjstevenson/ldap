var loginClient = angular.module('loginApp', ['ngGrid']);

loginClient.controller('LoginCtrl', function($scope, $http) {

    $scope.results = [];

    $scope.submit = function() {
        var query = { 'lastName': $scope.lastName };
        $scope.serverResult = null;
        if ($scope.lastName) {
            $http.post('/api/auth', query)
                .success(function(data, status, headers, config) {
                    $scope.results = data;
                });
        };
    };

    $scope.selectedColumns = [
        { field: 'givenName', displayName: 'FirstName' },
        { field: 'sn', displayName: 'LastName' },
        { field: 'employeeID', displayName: 'EmpoloyeeId'},
        { field: 'mail', displayName: 'EmailAddress' }
    ];

    $scope.gridOptions = {
        data: 'results',
        columnDefs: 'selectedColumns',
        enableColumnResize : true
    };
});
