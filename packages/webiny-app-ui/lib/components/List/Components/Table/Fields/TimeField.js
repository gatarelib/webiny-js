"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _get2 = require("lodash/get");

var _get3 = _interopRequireDefault(_get2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _webinyApp = require("webiny-app");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var TimeField = (function(_React$Component) {
    (0, _inherits3.default)(TimeField, _React$Component);

    function TimeField() {
        (0, _classCallCheck3.default)(this, TimeField);
        return (0, _possibleConstructorReturn3.default)(
            this,
            (TimeField.__proto__ || Object.getPrototypeOf(TimeField)).apply(this, arguments)
        );
    }

    (0, _createClass3.default)(TimeField, [
        {
            key: "render",
            value: function render() {
                var _this2 = this;

                var _props = this.props,
                    List = _props.List,
                    format = _props.format,
                    render = _props.render,
                    props = (0, _objectWithoutProperties3.default)(_props, [
                        "List",
                        "format",
                        "render"
                    ]);

                if (render) {
                    return render.call(this);
                }

                var time = (0, _get3.default)(this.props.data, this.props.name);

                return _react2.default.createElement(List.Table.Field, props, function() {
                    try {
                        return _webinyApp.i18n.time(time, format);
                    } catch (e) {
                        return _this2.props.default;
                    }
                });
            }
        }
    ]);
    return TimeField;
})(_react2.default.Component);

TimeField.defaultProps = {
    name: null,
    default: "-",
    format: null
};

exports.default = (0, _webinyApp.createComponent)(TimeField, {
    modules: ["List"],
    tableField: true
});
//# sourceMappingURL=TimeField.js.map