angular.module("mms.componentBrowser.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/componentBrowser/templates/viewA.html","<div class=\"view-a\">\n\n</div>\n");
$templateCache.put("/componentBrowser/templates/componentBrowser.html","<div class=\"component-browser\" ng-class=\"{ \'no-header\': !ctrl.showHeader } \">\n\n    <div class=\"header-panel\" ng-if=\"ctrl.showHeader\">\n        <h2><img id=\"morph-logo\" src=\"images/metamorph.png\"/> Component Browser</h2>\n    </div>\n    <component-search\n        ng-if=\"ctrl.componentsToList\"\n        search-text=\"ctrl.searchText\"\n        class=\"top-component-search\"\n        column-search-text=\"ctrl.columnSearchText\"\n        do-search=\"ctrl.getSearchResults\"\n        ></component-search>\n    <div class=\"left-panel\">\n        <component-categories\n            selected-category=\"ctrl.selectedCategory\"\n            on-selection-change=\"ctrl.onCategorySelectionChange\"\n            lock-grid-columns=\"ctrl.lockGridColumns\"\n            ></component-categories>\n    </div>\n\n    <div class=\"main-container-panel\">\n\n        <div ng-if=\"ctrl.componentsToList\" class=\"not-empty-list-content\">\n\n            <div ng-if=\"!ctrl.filtered\">\n                <h5>Components in <i>{{ctrl.selectedCategory.label}}:</i></h5>\n            </div>\n\n            <div ng-if=\"ctrl.filtered\">\n                <h5>Search results for <i>{{ctrl.resultsForSearchText}}:</i></h5>\n            </div>\n\n\n            <component-listing\n                components-to-list=\"ctrl.componentsToList\"\n                paging-parameters=\"ctrl.pagingParameters\"\n                get-next-page=\"ctrl.getNextPage\"\n                get-prev-page=\"ctrl.getPrevPage\"\n                on-page=\"ctrl.onPage\"\n                selected-category=\"ctrl.selectedCategory\"\n                search-text=\"ctrl.searchText\"\n                column-search-text=\"ctrl.columnSearchText\"\n                column-sort-info=\"ctrl.columnSortInfo\"\n                new-data=\"ctrl.newData\"\n                faceted-search=\"ctrl.facetedSearch\"\n                set-faceted-search=\"ctrl.setFacetedSearch\"\n                lock-grid-columns=\"ctrl.lockGridColumns\"\n                selected-view=\"ctrl.listingView\"\n                on-listing-view-selection=\"ctrl.onListingViewSelection(view)\"\n                on-item-drag-start=\"ctrl.onItemDragStart\"\n                on-item-drag-end=\"ctrl.onItemDragEnd\"\n                no-download=\"ctrl.noDownload\"\n                >\n            </component-listing>\n\n\n        </div>\n\n        <div class=\"text-center empty-list-content\"\n             ng-if=\"!ctrl.componentsToList\"\n            >\n\n            <component-search\n                search-text=\"ctrl.searchText\"\n                do-search=\"ctrl.getSearchResults\"\n                ></component-search>\n\n\n            <div class=\"no-components-to-list panel panel-info\" ng-if=\"!ctrl.errorMessage\">\n                <div class=\"panel-body\">\n                    <i class=\"info-icon glyphicon glyphicon-info-sign\"></i> Search for a keyword or browse the categories on the left and choose a class of categories to list.\n                </div>\n            </div>\n\n            <div class=\"error-message alert alert-warning\" role=\"alert\" ng-if=\"ctrl.errorMessage\">\n                <i class=\"glyphicon glyphicon-warning-sign\"></i> {{ctrl.errorMessage}}\n            </div>\n\n        </div>\n\n\n    </div>\n\n\n</div>\n");
$templateCache.put("/componentBrowser/templates/componentListing.html","<div class=\"component-listing\">\n\n    <div ng-if=\"ctrl.componentsToList\" class=\"not-empty-list-content\">\n\n        <div class=\"paging-buttons upper\">\n            <paging\n                config=\"ctrl.pagingParameters\"\n                on-next-page=\"ctrl.getNextPage\"\n                on-prev-page=\"ctrl.getPrevPage\"\n                >\n\n            </paging>\n        </div>\n\n        <count-display from-number=\"ctrl.pagingParameters.fromNumber\"\n                       to-number=\"ctrl.pagingParameters.toNumber\"\n                       ng-if=\"ctrl.componentsToList.length\"\n                       total-count=\"ctrl.pagingParameters.totalCount\"></count-display>\n\n\n        <view-selection selected-view=\"ctrl.selectedView\" on-view-selection=\"ctrl.onViewSelection(view)\"></view-selection>\n\n\n\n        <div class=\"listing-views container-fluid\">\n\n            <list-view\n                ng-if=\"ctrl.selectedView === \'ListView\'\"\n                components=\"ctrl.componentsToList\"\n                on-item-drag-start=\"ctrl.onItemDragStart\"\n                on-item-drag-end=\"ctrl.onItemDragEnd\"\n                no-download=\"ctrl.noDownload\"\n                ></list-view>\n\n            <grid-view\n                ng-if=\"ctrl.selectedView === \'GridView\'\"\n                components=\"ctrl.componentsToList\"\n                selected-category=\"ctrl.selectedCategory\"\n                search-text=\"ctrl.searchText\"\n                column-search-text=\"ctrl.columnSearchText\"\n                column-sort-info=\"ctrl.columnSortInfo\"\n                paging-parameters=\"ctrl.pagingParameters\"\n                new-data=\"ctrl.newData\"\n                faceted-search=\"ctrl.facetedSearch\"\n                set-faceted-search=\"ctrl.setFacetedSearch\"\n                lock-grid-columns=\"ctrl.lockGridColumns\"\n                on-item-drag-start=\"ctrl.onItemDragStart\"\n                on-item-drag-end=\"ctrl.onItemDragEnd\"\n                no-download=\"ctrl.noDownload\"\n                ></grid-view>\n\n        </div>\n\n        <div class=\"paging-buttons lower\">\n            <paging\n                config=\"ctrl.pagingParameters\"\n                on-next-page=\"ctrl.getNextPage\"\n                on-prev-page=\"ctrl.getPrevPage\"\n                >\n\n            </paging>\n        </div>\n\n\n    </div>\n\n\n\n</div>\n");
$templateCache.put("/componentBrowser/templates/componentCategories.html","<div class=\"component-categories\">\n    <h4>Categories</h4>\n    <tree-navigator tree-data=\"ctrl.treeData\" config=\"ctrl.config\"></tree-navigator>\n</div>\n\n");
$templateCache.put("/componentBrowser/templates/componentSearch.html","<div class=\"component-search\">\n    <input type=\"text\" name=\"search\"\n           ng-model=\"ctrl.searchText\"\n           ng-keydown=\"ctrl.keydownInSearchField($event)\"\n           class=\"form-control search-field\"/>\n    <button class=\"btn btn-default search-button\" ng-click=\"ctrl.doSearch()\">Search</button>\n</div>\n");
$templateCache.put("/componentBrowser/templates/countDisplay.html","<div class=\"count-display\">\n    {{ numeral(ctrl.fromNumber).format(\'0,0\') }} to {{ numeral(ctrl.toNumber).format(\'0,0\') }} displayed of {{ numeral(ctrl.totalCount).format(\'0,0\') }}\n</div>\n");
$templateCache.put("/componentBrowser/templates/downloadButton.html","<div class=\"download-button\"\n        type=\"button\"\n        title=\"Download component\">\n    <span class=\"glyphicon glyphicon-circle-arrow-down\" aria-hidden=\"true\"></span>\n</div>\n");
$templateCache.put("/componentBrowser/templates/gridView.html","<div context-menu class=\"grid-view row\">\n    <div ui-grid=\"ctrl.gridOptions\" ui-grid-resize-columns></div>\n</div>\n\n");
$templateCache.put("/componentBrowser/templates/infoButton.html","<div class=\"info-button\"\n     type=\"button\"\n     title=\"Octopart listing\">\n    <span class=\"glyphicon glyphicon-info-sign\" aria-hidden=\"true\"></span>\n</div>\n");
$templateCache.put("/componentBrowser/templates/itemDetail.html","<div class=\"component-detail\">\nDetail goes here: <b>{{item.details}}</b>\n</div>\n");
$templateCache.put("/componentBrowser/templates/itemHeader.html","<header>\n    <h4>\n        <download-button ng-if=\"!config.noDownload\" ng-click=\"config.itemDownload($event, item)\"></download-button>\n        <info-button ng-if=\"item.octopart!==undefined\" ng-click=\"config.itemInfo($event, item)\"></info-button>\n        <span class=\"item-title\">{{ item.title }}</span></h4>\n    <il-item-menu></il-item-menu>\n</header>\n");
$templateCache.put("/componentBrowser/templates/listView.html","<div class=\"list-view\">\n    <item-list list-data=\"ctrl.listData\" config=\"ctrl.config\"></item-list>\n</div>\n");
$templateCache.put("/componentBrowser/templates/paging.html","<div class=\"paging text-center\">\n    <div class=\"btn-group\" ng-if=\"ctrl.canPrevPage() || ctrl.canNextPage()\">\n        <button type=\"button\"\n                class=\"btn btn-default previous-page\"\n                aria-label=\"List\"\n                title=\"List view\"\n                ng-disabled=\"!ctrl.canPrevPage()\"\n                ng-click=\"ctrl.prevPage()\"\n            >\n            <span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span>Previous page\n        </button>\n        <button type=\"button\"\n                class=\"btn btn-default next-page\"\n                aria-label=\"Grid\"\n                title=\"Grid view\"\n                ng-disabled=\"!ctrl.canNextPage()\"\n                ng-click=\"ctrl.nextPage()\"\n            >\n            Next page <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span>\n        </button>\n    </div>\n</div>\n");
$templateCache.put("/componentBrowser/templates/viewSelection.html","<div class=\"view-selection btn-group\">\n    <button type=\"button\"\n            class=\"btn btn-default\"\n            aria-label=\"List\"\n            title=\"List view\"\n            ng-click=\"ctrl.selectView(\'ListView\')\"\n            ng-class=\"{ \'selected\': ctrl.selectedView === \'ListView\' }\"\n        >\n        <span class=\"glyphicon glyphicon-th-list\" aria-hidden=\"true\"></span>\n    </button>\n    <button type=\"button\"\n            class=\"btn btn-default\"\n            aria-label=\"Grid\"\n            title=\"Grid view\"\n            ng-click=\"ctrl.selectView(\'GridView\')\"\n            ng-class=\"{ \'selected\': ctrl.selectedView === \'GridView\' }\"\n        >\n        <span class=\"glyphicon glyphicon-th\" aria-hidden=\"true\"></span>\n    </button>\n</div>\n");}]);