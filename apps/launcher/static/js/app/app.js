function LauncherCtrl($scope, $http){
	top.launcherCtrlScope = $scope; // Debug

	$http.get("/files").
		success(function(files){
			angular.foreach(files, function(file, i){
				$scope.files.push({path: file, index: i});
			});
		});

	$scope.play = function(id){
		$http.put("/play", {id: id});
	};
}