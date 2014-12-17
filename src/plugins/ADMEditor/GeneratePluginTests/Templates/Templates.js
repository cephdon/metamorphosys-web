/* global define,require */
/* Generated file based on ejs templates */
define([], function() {
    return {
    "TestTemplate.js.ejs": "<%\nvar test, i, resultStr;\n%>\n\n\nif (typeof window === 'undefined') {\n\n    // server-side setup\n    var webgme = require('webgme');\n    var webgmeConfig = require('../../../config.json');\n    webGMEGlobal.setConfig(webgmeConfig);\n\n    var chai = require('chai');\n}\n\ndescribe('<%=name%>', function () {\n    'use strict';\n    <%for (i = 0; i < tests.length; i += 1) {\n        test = tests[i];\n        resultStr = test.success ? 'succeed' : 'fail';\n%>\n    it('<%=test.plugin%> should <%=resultStr%> on <%=test.name%>', function (done) {\n        var projectName = 'ADMEditor',\n            pluginName = '<%=test.plugin%>',\n            testPoint = '<%=test.testPoint%>',\n            expectedSuccess = <%=test.success%>,\n            assetHash = '<%=test.asset%>';\n\n        webgme.runPlugin.main(webGMEGlobal.getConfig(), {\n            projectName: projectName,\n            pluginName: pluginName,\n            activeNode: testPoint\n        }, function (err, result) {\n            chai.expect(err).to.equal(null);\n            chai.expect(result.getSuccess()).to.equal(expectedSuccess);\n            done();\n        });\n    });\n<%}%>\n});"
};});