"use strict";

angular.module('AppProjectServerDeploy', [
    'ngRoute',
]).config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/view/:id/:name/server/:server_id/deploy', {
            templateUrl: 'app/pages/project/server/deploy.html',
            controller: 'serverDeployController',
        });
    }
]).controller('serverDeployController', [
    '$scope',
    '$rootScope',
    '$routeParams',
    'Utils',
    'Api',
    '$window',
    '$q',
    '$ngConfirm',
    'Const',
    'Components',
    '$location',
    function ($scope, $rootScope, $routeParams, Utils, Api, $window, $q, $ngConfirm, Const, Components, $location) {
        $scope.project_id = $routeParams.id;
        $scope.server_id = $routeParams.server_id;
        $scope.project = $rootScope.projects[$scope.project_id];

        $scope.deploy = {};
        $scope.page = 'server-deploy';
        Utils.setTitle('Deploy');

        var server = {};
        angular.forEach($scope.project.servers, function (s) {
            if (s.id == $scope.server_id)
                server = s;
        });
        $scope.server = server;
        if ($scope.server.revision) {
            $scope.deploy.type = Const.record_type_update.toString();
        } else {
            $scope.deploy.type = Const.record_type_fresh_upload.toString();
        }

        $rootScope.$broadcast('setBreadcrumb', [
            {
                link: "view/" + $scope.project.id + "/" + $scope.project.name,
                name: $scope.project.name
            },
            {
                link: "view/" + $scope.project.id + "/" + $scope.project.name + "/server/" + $scope.server_id,
                name: $scope.server.name
            },
            {
                link: "",
                name: "Deploy"
            }
        ]);


        // deploy to revision

        $scope.fetchingComparision = false;
        $scope.targetCommit = $scope.server.branch;
        $scope.targetChanges = {};
        $scope.compareError = false;
        $scope.fetchComparision = function () {
            $scope.compareError = false;
            $scope.fetchingComparision = true;
            $scope.targetChanges = {};
            Api.compareCommits($scope.project_id, $scope.server_id, $scope.server.revision, $scope.targetCommit)
                .then(function (comparison) {
                    $scope.fetchingComparision = false;
                    $scope.targetChanges = comparison;
                }, function (reason) {
                    $scope.fetchingComparision = false;
                    $scope.compareError = reason;
                });
        };

        $scope.deploySpecific = function () {
            Components.showLatestRevisions({
                title: 'Deploy to revision'
            }, $scope.project_id, $scope.server.branch).then(function (commit) {
                if (!commit)
                    return;
                $scope.targetCommit = commit.sha;
                $scope.fetchComparision();
            }, function (reason) {
                Utils.error(reason, 'red');
            });
        };

        $scope.revisionDeployProcessing = false;
        $scope.revisionDeploy = function () {
            var deploy = {};
            deploy.type = Const.record_type_update;
            deploy.target_revision = $scope.targetCommit;
            $scope.revisionDeployProcessing = true;
            Api.applyDeploy($scope.project_id, $scope.server_id, deploy).then(function (res) {
                $scope.revisionDeployProcessing = false;
                $location.path('view/' + $scope.project_id + '/' + $scope.projects[$scope.project_id].name);
            }, function (reason) {
                Utils.error(reason, 'red', $scope.revisionDeploy);
                $scope.revisionDeployProcessing = false;
            });
        };

        // END deploy to revision

        // fresh upload

        $scope.freshDeployProcessing = false;
        $scope.freshDeploy = function () {
            var deploy = {};
            deploy.type = Const.record_type_fresh_upload;
            deploy.target_revision = $scope.selectedCommit.sha;
            $scope.freshDeployProcessing = true;
            Api.applyDeploy($scope.project_id, $scope.server_id, deploy).then(function (res) {
                $scope.freshDeployProcessing = false;
                $location.path('view/' + $scope.project_id + '/' + $scope.projects[$scope.project_id].name);
            }, function (reason) {
                Utils.error(reason, 'red', $scope.freshDeploy);
                $scope.freshDeployProcessing = false;
            })
        };

        $scope.gettingLatest = false;
        $scope.selectedCommit = {};
        $scope.getLatestRevision = function () {
            if (Object.keys($scope.selectedCommit).length)
                return false;

            $scope.gettingLatest = true;
            Api.getRevisions($scope.project_id, $scope.server.branch).then(function (revisions) {
                $scope.selectedCommit = revisions[0];
                $scope.gettingLatest = false;
            }, function (reason) {
                $scope.gettingLatest = false;
                Utils.notification(reason, 'red');
            });
        };

        $scope.selectRevision = function () {
            Components.showLatestRevisions({
                title: 'Upload revision'
            }, $scope.project_id, $scope.server.branch).then(function (commit) {
                if (!commit)
                    return;

                $scope.selectedCommit = commit;
            }, function (reason) {
                Utils.error(reason, 'red');
            });
        };

        // END fresh upload

        $scope.typeChange = function () {
            if ($scope.deploy.type == Const.record_type_update) {
                $scope.fetchComparision();
            } else {
                $scope.getLatestRevision();
            }
        };
        $scope.typeChange();

    }
]);