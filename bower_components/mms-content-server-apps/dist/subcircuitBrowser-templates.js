angular.module("mms.subcircuitBrowser.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/subcircuitBrowser/templates/subcircuitBrowser.html","<div class=\"subcircuit-browser content-browser\" ng-class=\"{ \'embedded\': ctrl.embedded } \">\n\n    <div class=\"header-panel\" ng-if=\"!ctrl.embedded\">\n        <h2><img id=\"morph-logo\" src=\"images/metamorph.png\"/> Subcircuit Browser</h2>\n    </div>\n    <component-search\n        ng-if=\"ctrl.componentsToList\"\n        search-text=\"ctrl.searchText\"\n        class=\"top-component-search\"\n        column-search-text=\"ctrl.columnSearchText\"\n        do-search=\"ctrl.getSearchResults\"\n        >\n        </component-search>\n\n    <div class=\"left-panel\">\n        <subcircuit-categories\n            selected-category=\"ctrl.selectedCategory\"\n            on-selection-change=\"ctrl.onCategorySelectionChange\"\n            lock-grid-columns=\"ctrl.lockGridColumns\"\n            ></subcircuit-categories>\n    </div>\n\n    <category-resizer min-width=\"100\"></category-resizer>\n\n    <div class=\"main-container-panel\">\n\n        <div ng-if=\"ctrl.componentsToList\" class=\"not-empty-list-content\">\n\n            <subcircuit-listing\n                components-to-list=\"ctrl.componentsToList\"\n                paging-parameters=\"ctrl.pagingParameters\"\n                get-next-page=\"ctrl.getNextPage\"\n                get-prev-page=\"ctrl.getPrevPage\"\n                on-page=\"ctrl.onPage\"\n                selected-category=\"ctrl.selectedCategory\"\n                search-text=\"ctrl.searchText\"\n                column-search-text=\"ctrl.columnSearchText\"\n                column-sort-info=\"ctrl.columnSortInfo\"\n                new-data=\"ctrl.newData\"\n                faceted-search=\"ctrl.facetedSearch\"\n                set-faceted-search=\"ctrl.setFacetedSearch\"\n                lock-grid-columns=\"ctrl.lockGridColumns\"\n                selected-view=\"ctrl.listingView\"\n                on-listing-view-selection=\"ctrl.onListingViewSelection(view)\"\n                on-item-drag-start=\"ctrl.onItemDragStart\"\n                on-item-drag-end=\"ctrl.onItemDragEnd\"\n                no-download=\"ctrl.noDownload\"\n                set-items-per-page=\"ctrl.setItemsPerPage\"\n                results-for-search-text=\"ctrl.resultsForSearchText\"\n                >\n            </subcircuit-listing>\n\n\n        </div>\n\n        <div class=\"text-center empty-list-content\"\n             ng-if=\"!ctrl.componentsToList\"\n            >\n\n            <component-search\n                search-text=\"ctrl.searchText\"\n                do-search=\"ctrl.getSearchResults\"\n                ></component-search>\n\n\n            <div class=\"no-components-to-list panel panel-info\" ng-if=\"!ctrl.errorMessage\">\n                <div class=\"panel-body\">\n                    <i class=\"info-icon glyphicon glyphicon-info-sign\"></i> Search for a keyword or browse the categories on the left and choose a class of categories to list.\n                </div>\n            </div>\n\n            <div class=\"error-message alert alert-warning\" role=\"alert\" ng-if=\"ctrl.errorMessage\">\n                <i class=\"glyphicon glyphicon-warning-sign\"></i> {{ctrl.errorMessage}}\n            </div>\n\n        </div>\n\n\n    </div>\n\n\n</div>\n");
$templateCache.put("/subcircuitBrowser/templates/componentCategoryExtraInfo.html","<div class=\"component-category-extra-info\">\n    <div class=\"total-children-count\" ng-if=\"::ctrl.node.categoryTotal\">[{{::ctrl.node.categoryTotal}}]</div>\n</div>");
$templateCache.put("/subcircuitBrowser/templates/subcircuitCategories.html","<div class=\"subcircuit-categories content-categories\">\n    <tree-navigator tree-data=\"ctrl.treeData\" config=\"ctrl.config\"></tree-navigator>\n</div>\n\n");
$templateCache.put("/subcircuitBrowser/templates/itemDetail.html","<subcircuit-details details=\"item.details.documentation\" ng-class=\"{ \'expanded-details\': item.expandedDetails }\"></subcircuit-details>\n<show-more-button ng-if=\"!item.expandedDetails\" ng-click=\"item.expandDetails(item)\"></show-more-button>\n<show-less-button ng-if=\"item.expandedDetails\" ng-click=\"item.expandedDetails = false;\"></show-less-button>\n");
$templateCache.put("/subcircuitBrowser/templates/itemHeader.html","<header>\n    <h4>\n        <download-button ng-if=\"!config.noDownload\" ng-click=\"config.itemDownload($event, item)\"></download-button>\n        <span class=\"item-title\">{{ item.title }}</span>\n    </h4>\n    <il-item-menu></il-item-menu>\n</header>\n");
$templateCache.put("/subcircuitBrowser/templates/subcircuitListView.html","<div class=\"subcircuit-list-view content-list-view\">\n    <item-list list-data=\"ctrl.listData\" config=\"ctrl.config\"></item-list>\n</div>\n");
$templateCache.put("/subcircuitBrowser/templates/subcircuitListing.html","<div class=\"subcircuit-listing content-listing\">\n\n    <div ng-if=\"ctrl.componentsToList\" class=\"not-empty-list-content\">\n\n        <!-- DISABLE FOR SOLIDCON - NO NEED GIVEN SMALL NUMBER OF SUBCIRCUITS\n        <div class=\"listing-header\">\n\n            <div ng-if=\"!ctrl.resultsForSearchText\" class=\"listing-subheader\">\n                Components in <i>{{ctrl.selectedCategory.label}}:</i>\n            </div>\n\n            <div ng-if=\"ctrl.resultsForSearchText\" class=\"listing-subheader\">\n                Search results for <i>{{ctrl.resultsForSearchText}}:</i>\n            </div>\n\n\n            <div class=\"paging-buttons upper\">\n                <paging\n                    config=\"ctrl.pagingParameters\"\n                    on-next-page=\"ctrl.getNextPage\"\n                    on-prev-page=\"ctrl.getPrevPage\"\n                    >\n\n                </paging>\n            </div>\n\n            <count-display from-number=\"ctrl.pagingParameters.fromNumber\"\n                           to-number=\"ctrl.pagingParameters.toNumber\"\n                           ng-if=\"ctrl.componentsToList.length\"\n                           total-count=\"ctrl.pagingParameters.totalCount\"\n                           items-per-page=\"ctrl.pagingParameters.itemsPerPage\"\n                            set-items-per-page=\"ctrl.setItemsPerPage\"\n                           ></count-display>\n\n\n            <view-selection selected-view=\"ctrl.selectedView\" on-view-selection=\"ctrl.onViewSelection(view)\"></view-selection>\n\n        </div>-->\n\n        <div class=\"listing-views container-fluid\">\n\n            <subcircuit-list-view\n                ng-if=\"ctrl.selectedView === \'ListView\'\"\n                components=\"ctrl.componentsToList\"\n                selected-category=\"ctrl.selectedCategory\"\n                paging-parameters=\"ctrl.pagingParameters\"\n                new-data=\"ctrl.newData\"\n                on-item-drag-start=\"ctrl.onItemDragStart\"\n                on-item-drag-end=\"ctrl.onItemDragEnd\"\n                no-download=\"ctrl.noDownload\"\n                content-library-service=\"ctrl.contentLibraryService\"\n                ></subcircuit-list-view>\n\n<!--             <grid-view\n                ng-if=\"ctrl.selectedView === \'GridView\'\"\n                components=\"ctrl.componentsToList\"\n                selected-category=\"ctrl.selectedCategory\"\n                search-text=\"ctrl.searchText\"\n                column-search-text=\"ctrl.columnSearchText\"\n                column-sort-info=\"ctrl.columnSortInfo\"\n                paging-parameters=\"ctrl.pagingParameters\"\n                new-data=\"ctrl.newData\"\n                faceted-search=\"ctrl.facetedSearch\"\n                set-faceted-search=\"ctrl.setFacetedSearch\"\n                lock-grid-columns=\"ctrl.lockGridColumns\"\n                on-item-drag-start=\"ctrl.onItemDragStart\"\n                on-item-drag-end=\"ctrl.onItemDragEnd\"\n                no-download=\"ctrl.noDownload\"\n                ></grid-view>\n -->\n        </div>\n\n    </div>\n\n\n\n</div>\n");}]);