(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'datacontext', dashboard]);

    function dashboard(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.attendeeCount = 0;
        vm.speakerCount = 0;
        vm.sessionCount = 0;
        vm.content = {
           predicate: '',
           title: 'Content',
           setSort: setContentSort,
           reverse: false,
           tracks: []
        }
        vm.map = {
           title: 'Location'
        };
        vm.speakers = {
           interval: 5000,
           list: [],
           title: 'Top Speakers'
        }
        vm.news = {
            title: 'Code Camp',
            description: 'Code Camp is a community event where developers learn from the top experts.'
        };
        vm.title = 'Dashboard';

        activate();

        function activate() { // Execute all the functions that must run before showing the module
           getTopSpeakers();
           
           var promises = [getAttendeeCount(), getSessionCount(), getSpeakerCount(), getTrackCounts()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getAttendeeCount() {
           return datacontext.getAttendeeCount().then(function (data) {
                 return vm.attendeeCount = data;
              });
        }

        function getSessionCount() {
           return datacontext.getSessionCount().then(function (data) {
              return vm.sessionCount = data;
           });
        }

        function getTrackCounts() {
           return datacontext.getTrackCounts().then(function (data) {
              return vm.content.tracks = data;
           });
        }

        function getSpeakerCount() {
           var speakers = datacontext.getSpeakersLocal();
           return vm.speakerCount = speakers.length;
        }

        function getTopSpeakers() {
           vm.speakers.list = datacontext.getSpeakersTopLocal();
        }

        function setContentSort(prop) {
           vm.content.predicate = prop;
           vm.content.reverse = !vm.content.reverse;
        }
     }
})();