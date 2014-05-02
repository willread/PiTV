function LauncherCtrl($scope, $http){
	top.launcherCtrlScope = $scope; // Debug

	$http.get("/files").
		success(function(files){
		$scope.files = files;
		});

	$scope.play = function(id){
		$http.put("/play/" + id);
	};
}