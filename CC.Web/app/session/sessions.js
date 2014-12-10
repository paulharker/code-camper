(function () {
    'use strict';

    var controllerId = 'sessions';

    angular
        .module('app')
        .controller(controllerId,
        ['$routeParams', 'common', 'config', 'datacontext', sessions]);

    function sessions($routeParams, common, config, datacontext) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var log = getLogFn(controllerId);

       // Bindable properties and functions are placed on vm
        vm.filteredSesssions = [];
        vm.sessions = [];
        vm.sessionsFilter = sessionsFilter;
        vm.sessionsSearch = $routeParams.search || '';
        vm.search = search;
        vm.refresh = refresh;
        vm.title = 'Sessions';

        activate();

        function activate() {
            common.activateController([getSessions()], controllerId)
                .then(function () {
                   // createSearchThrottle uses values by convention, via its parameters:
                   //   vm.sessionsSearch is where the user enters the search
                   //   vm.sessions is the original unfiltered array
                   //   vm.filteredSessions is the filtered array
                   //   vm.sessionsFilter is the filtering function
                   //        function createSearchThrottle(viewmodel, list, filteredList, filter, delay) {

                   applyFilter = common.createSearchThrottle(vm, 'sessions')
                   if (vm.sessionsSearch){applyFilter(true)}
                   log('Activated Sessions View');
                });
        }

        function getSessions(forceRefresh) {
           return datacontext.getSessionPartials(forceRefresh)
              .then(function (data) {
                 vm.filteredSessions = data;
                return vm.sessions = vm.filteredSesssions = data;
            })
        }

        function refresh() { getSessions(true); }

        function search($event) {
           if ($event.keyCode === keyCodes.esc) {
              vm.sessionsSearch = '';
              applyFilter(true);
           } else {
              applyFilter();
           }
        }

        function sessionsFilter(session) {
           var textContains = common.textContains;
           var searchText = vm.sessionsSearch;
           var isMatch = searchText ? 
                 textContains(session.title, searchText)
              || textContains(session.tagsFormatted, searchText)
              || textContains(session.room.name, searchText)
              || textContains(session.track.name, searchText)
              || textContains(session.tags, searchText)
              || textContains(session.speaker.fullName, searchText)
            : true
           return isMatch;
           }

        function applyFilter() {        }
    }
})();
