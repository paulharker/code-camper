(function () {
   'use strict';

   var controllerId = 'attendees';

   angular
       .module('app')
       .controller(controllerId,
       ['config','common', 'datacontext', attendees]);

   function attendees(config, common, datacontext) {
      var vm = this;
      var getLogFn = common.logger.getLogFn;
      var keyCodes = config.keyCodes;
      var log = getLogFn(controllerId);

      // Bindable properties and fucntions are placed on vm
      vm.attendees = [];
      vm.attendeeCount = 0;
      vm.attendeeFilteredCount = 0;
      vm.attendeeSearch = '';
      vm.filteredAttendees = [];
      vm.pageChanged = pageChanged;
      vm.paging = {
         currentPage: 1,
         maxPagesToShow: 5,
         pageSize: 15
      };
      vm.refresh = refresh;
      vm.search = search;
      vm.title = 'Attendees';

      Object.defineProperty(vm.paging, 'pageCount', {
         get: function () {
            return Math.floor(vm.attendeeFilteredCount / vm.paging.pageSize) + 1;
         }
      });

      activate();

      function activate() {
         common.activateController([getAttendees()], controllerId)
             .then(function () { log('Activated Attendees View'); });
      }

      function getAttendeeCount() {
         return datacontext.getAttendeeCount()
            .then(function (data) {
               return vm.attendeeCount = data;
            });
      }

      function getAttendeeFilteredCount() {
         vm.attendeeFilteredCount = datacontext.getFilteredCount(vm.attendeeSearch);
      }

      function getAttendees(forceRefresh) {
         return datacontext.getAttendees(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.attendeeSearch)
            .then(function (data) {
               vm.attendees = data;
               getAttendeeFilteredCount();
               if (!vm.attendeeCount || forceRefresh) {
                  getAttendeeCount();
               }
               return data
            });
      }

      function pageChanged(page) {
         if (!page) { return };
         vm.paging.currentPage = page;
         getAttendees();
      }

      function refresh() { getAttendees(true); }

      function search($event) {
         if ($event.keyCode === keyCodes.esc) {
            vm.attendeeSearch = '';
         }
         getAttendees();
      }
   }
})();
