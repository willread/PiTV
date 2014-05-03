function LauncherCtrl($scope, $http){
	top.launcherCtrlScope = $scope; // Debug

	$http.get("/files").
		success(function(files){
			angular.forEach(files, function(file, i){
				file = file.split("/");
				file = file[file.length - 1];
				$scope.files.push({path: file, index: i});
			});
		});

	$scope.play = function(id){
		$http.put("/play", {id: id});
	};
}