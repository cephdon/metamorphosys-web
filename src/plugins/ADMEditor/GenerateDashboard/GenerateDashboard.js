/**
* Generated by PluginGenerator from webgme on Tue Nov 04 2014 13:59:08 GMT-0600 (Central Standard Time).
*/

define(['plugin/PluginConfig',
        'plugin/PluginBase',
        'plugin/GenerateDashboard/GenerateDashboard/meta',
        'plugin/AdmExporter/AdmExporter/AdmExporter'
    ], function (PluginConfig, PluginBase, MetaTypes, AdmExporter) {
    'use strict';

    /**
    * Initializes a new instance of GenerateDashboard.
    * @class
    * @augments {PluginBase}
    * @classdesc This class represents the plugin GenerateDashboard.
    * @constructor
    */
    var GenerateDashboard = function () {
        // Call base class' constructor.
        PluginBase.call(this);
        this.metaTypes = MetaTypes;
        this.admExporter = null;
    };

    // Prototypal inheritance from PluginBase.
    GenerateDashboard.prototype = Object.create(PluginBase.prototype);
    GenerateDashboard.prototype.constructor = GenerateDashboard;

    /**
    * Gets the name of the GenerateDashboard.
    * @returns {string} The name of the plugin.
    * @public
    */
    GenerateDashboard.prototype.getName = function () {
        return "Generate Dashboard";
    };

    /**
    * Gets the semantic version (semver.org) of the GenerateDashboard.
    * @returns {string} The version of the plugin.
    * @public
    */
    GenerateDashboard.prototype.getVersion = function () {
        return "0.1.0";
    };

    /**
    * Gets the description of the GenerateDashboard.
    * @returns {string} The description of the plugin.
    * @public
    */
    GenerateDashboard.prototype.getDescription = function () {
        return "Takes a list of Result Object IDs, and create a Dashboard package for visualization";
    };

    /**
     * Gets the configuration structure for the TestBenchRunner.
     * The ConfigurationStructure defines the configuration for the plugin
     * and will be used to populate the GUI when invoking the plugin from webGME.
     * @returns {object} The version of the plugin.
     * @public
     */
    GenerateDashboard.prototype.getConfigStructure = function () {
        return [
            {
                'name': 'ResultIDs',
                'displayName': 'Result Object IDs',
                'description': 'IDs of Result objects to add to the Generated Dashboard, separated by semicolons.',
                'value': '',
                'valueType': 'string',
                'readOnly': false
            }
        ];
    };

    /**
    * Main function for the plugin to execute. This will perform the execution.
    * Notes:
    * - Always log with the provided logger.[error,warning,info,debug].
    * - Do NOT put any user interaction logic UI, etc. inside this method.
    * - callback always has to be called even if error happened.
    *
    * @param {function(string, plugin.PluginResult)} callback - the result callback
    */
    GenerateDashboard.prototype.main = function (callback) {
        // Use self to access core, project, result, logger etc from PluginBase.
        // These are all instantiated at this point.
        var self = this,
            config = self.getCurrentConfig();

        self.updateMETA(self.metaTypes);

        // Run AdmExporter to get design_space/%ThisDesignName%.adm

        // Create a manifest_project object (like the manifest.project.json file)

        // Create a results_metaresults object (like the results.metaresults.json file)

        // Iterate over the list of Result IDs
            // Download the cfg.adm
            // 'rename' it according to the WebGME name, and set the ID (DesignID) inside the xml
            // Download the artifact (testbench_manifest.json) - need to modify it to point to ThisDesignName.adm DesignID
            // follow the pointer to the Testbench object, and get/create the ThisTestBench.testbench.json file/object

        self.result.setSuccess(true);
        self.save('added obj', function (err) {
            callback(null, self.result);
        });

    };

//    GenerateDashboard.prototype.initializeAdmExporter = function () {
//        var self = this;
//        if (self.admExporter === null) {
//            self.admExporter = new AdmExporter();
//            self.admExporter.meta = self.meta;
//            self.admExporter.META = self.META;
//            self.admExporter.core = self.core;
//            self.admExporter.logger = self.logger;
//            self.admExporter.result = self.result;
//            self.admExporter.rootNode = self.rootNode;
//            self.logger.info('AdmExporter had not been initialized - created a new instance.');
//        } else {
//            self.admExporter.acmFiles = {};
//            self.admExporter.gatheredAcms = {};
//            self.admExporter.rootPath = null;
//            self.admExporter.includeAcms = true;
//            self.logger.info('AdmExporter had already been initialized - reset acmFiles, gatheredAcms and rootPath.');
//        }
//    };

    return GenerateDashboard;
});