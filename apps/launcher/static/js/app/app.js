function LauncherCtrl($scope, $http){
	top.launcherCtrlScope = $scope; // Debug
	$scope.files = [];
	$http.get("/files").
		success(function(files){
			angular.forEach(files, function(file, i){
				var name = file.split("/");
				name = name[name.length - 1];
				$scope.files.push({path: file, name: name, index: i});
			});
		});

	$scope.play = function(id){
		// $http.put("/play", {id: id});
		$http.put("/omx/start/" + $scope.files[id].path.replace(/(["\s'$`\\])/g,'\\$1'));
	};

	$scope.game = function(){
		$http.get("/game");
	};
}