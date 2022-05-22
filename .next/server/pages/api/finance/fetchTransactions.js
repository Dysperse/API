"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/finance/fetchTransactions";
exports.ids = ["pages/api/finance/fetchTransactions"];
exports.modules = {

/***/ "(api)/./pages/api/finance/fetchTransactions.ts":
/*!************************************************!*\
  !*** ./pages/api/finance/fetchTransactions.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\nvar myHeaders = new Headers();\nmyHeaders.append(\"Content-Type\", \"application/json\");\nfunction handler(req, res) {\n    var _access_token, _start_date, _end_date;\n    fetch(\"https://sandbox.plaid.com/transactions/get\", {\n        method: \"POST\",\n        headers: myHeaders,\n        body: JSON.stringify({\n            client_id: process.env.PLAID_CLIENT_TOKEN,\n            secret: process.env.PLAID_SECRET,\n            access_token: (_access_token = req.query.access_token) !== null && _access_token !== void 0 ? _access_token : \"false\",\n            start_date: (_start_date = req.query.start_date) !== null && _start_date !== void 0 ? _start_date : \"false\",\n            end_date: (_end_date = req.query.end_date) !== null && _end_date !== void 0 ? _end_date : \"false\"\n        }),\n        redirect: \"follow\"\n    }).then((response)=>response.json()\n    ).then((result)=>res.json(result)\n    ).catch((error)=>console.log(\"error\", error)\n    );\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZmluYW5jZS9mZXRjaFRyYW5zYWN0aW9ucy50cy5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsU0FBUyxHQUFHLElBQUlDLE9BQU8sRUFBRTtBQUM3QkQsU0FBUyxDQUFDRSxNQUFNLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFFdEMsU0FBU0MsT0FBTyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsRUFBRTtRQU90QkQsYUFBc0IsRUFDeEJBLFdBQW9CLEVBQ3RCQSxTQUFrQjtJQVJoQ0UsS0FBSyxDQUFDLDRDQUE0QyxFQUFFO1FBQ2xEQyxNQUFNLEVBQUUsTUFBTTtRQUNkQyxPQUFPLEVBQUVSLFNBQVM7UUFDbEJTLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFTLENBQUM7WUFDbkJDLFNBQVMsRUFBRUMsT0FBTyxDQUFDQyxHQUFHLENBQUNDLGtCQUFrQjtZQUN6Q0MsTUFBTSxFQUFFSCxPQUFPLENBQUNDLEdBQUcsQ0FBQ0csWUFBWTtZQUNoQ0MsWUFBWSxFQUFFZCxDQUFBQSxhQUFzQixHQUF0QkEsR0FBRyxDQUFDZSxLQUFLLENBQUNELFlBQVksY0FBdEJkLGFBQXNCLGNBQXRCQSxhQUFzQixHQUFJLE9BQU87WUFDL0NnQixVQUFVLEVBQUVoQixDQUFBQSxXQUFvQixHQUFwQkEsR0FBRyxDQUFDZSxLQUFLLENBQUNDLFVBQVUsY0FBcEJoQixXQUFvQixjQUFwQkEsV0FBb0IsR0FBSSxPQUFPO1lBQzNDaUIsUUFBUSxFQUFFakIsQ0FBQUEsU0FBa0IsR0FBbEJBLEdBQUcsQ0FBQ2UsS0FBSyxDQUFDRSxRQUFRLGNBQWxCakIsU0FBa0IsY0FBbEJBLFNBQWtCLEdBQUksT0FBTztTQUN4QyxDQUFDO1FBQ0ZrQixRQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDLENBQ0NDLElBQUksQ0FBQyxDQUFDQyxRQUFRLEdBQUtBLFFBQVEsQ0FBQ0MsSUFBSSxFQUFFO0lBQUEsQ0FBQyxDQUNuQ0YsSUFBSSxDQUFDLENBQUNHLE1BQU0sR0FBS3JCLEdBQUcsQ0FBQ29CLElBQUksQ0FBQ0MsTUFBTSxDQUFDO0lBQUEsQ0FBQyxDQUNsQ0MsS0FBSyxDQUFDLENBQUNDLEtBQUssR0FBS0MsT0FBTyxDQUFDQyxHQUFHLENBQUMsT0FBTyxFQUFFRixLQUFLLENBQUM7SUFBQSxDQUFDLENBQUM7Q0FDbEQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zbWFydGxpc3QvLi9wYWdlcy9hcGkvZmluYW5jZS9mZXRjaFRyYW5zYWN0aW9ucy50cz8yNjRkIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xubXlIZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgZmV0Y2goXCJodHRwczovL3NhbmRib3gucGxhaWQuY29tL3RyYW5zYWN0aW9ucy9nZXRcIiwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogbXlIZWFkZXJzLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGNsaWVudF9pZDogcHJvY2Vzcy5lbnYuUExBSURfQ0xJRU5UX1RPS0VOLFxuICAgICAgc2VjcmV0OiBwcm9jZXNzLmVudi5QTEFJRF9TRUNSRVQsXG4gICAgICBhY2Nlc3NfdG9rZW46IHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW4gPz8gXCJmYWxzZVwiLFxuICAgICAgc3RhcnRfZGF0ZTogcmVxLnF1ZXJ5LnN0YXJ0X2RhdGUgPz8gXCJmYWxzZVwiLFxuICAgICAgZW5kX2RhdGU6IHJlcS5xdWVyeS5lbmRfZGF0ZSA/PyBcImZhbHNlXCJcbiAgICB9KSxcbiAgICByZWRpcmVjdDogXCJmb2xsb3dcIlxuICB9KVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC50aGVuKChyZXN1bHQpID0+IHJlcy5qc29uKHJlc3VsdCkpXG4gICAgLmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvcikpO1xufVxuIl0sIm5hbWVzIjpbIm15SGVhZGVycyIsIkhlYWRlcnMiLCJhcHBlbmQiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjbGllbnRfaWQiLCJwcm9jZXNzIiwiZW52IiwiUExBSURfQ0xJRU5UX1RPS0VOIiwic2VjcmV0IiwiUExBSURfU0VDUkVUIiwiYWNjZXNzX3Rva2VuIiwicXVlcnkiLCJzdGFydF9kYXRlIiwiZW5kX2RhdGUiLCJyZWRpcmVjdCIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJyZXN1bHQiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImxvZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/finance/fetchTransactions.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/finance/fetchTransactions.ts"));
module.exports = __webpack_exports__;

})();