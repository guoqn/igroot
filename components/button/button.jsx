var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'omit.js';
import Icon from '../icon';
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
function isString(str) {
    return typeof str === 'string';
}
// Insert one space between two chinese characters automatically.
function insertSpace(child, needInserted) {
    // Check the child if is undefined or null.
    if (child == null) {
        return;
    }
    const SPACE = needInserted ? ' ' : '';
    // strictNullChecks oops.
    if (typeof child !== 'string' && typeof child !== 'number' &&
        isString(child.type) && isTwoCNChar(child.props.children)) {
        return React.cloneElement(child, {}, child.props.children.split('').join(SPACE));
    }
    if (typeof child === 'string') {
        if (isTwoCNChar(child)) {
            child = child.split('').join(SPACE);
        }
        return <span>{child}</span>;
    }
    return child;
}
export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = (e) => {
            // Add click effect
            this.setState({ clicked: true });
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.setState({ clicked: false }), 500);
            const onClick = this.props.onClick;
            if (onClick) {
                onClick(e);
            }
        };
        // Handle auto focus when click button in Chrome
        this.handleMouseUp = (e) => {
            if (this.props.onMouseUp) {
                this.props.onMouseUp(e);
            }
        };
        this.state = {
            loading: props.loading,
        };
    }
    componentWillReceiveProps(nextProps) {
        const currentLoading = this.props.loading;
        const loading = nextProps.loading;
        if (currentLoading) {
            clearTimeout(this.delayTimeout);
        }
        if (typeof loading !== 'boolean' && loading && loading.delay) {
            this.delayTimeout = setTimeout(() => this.setState({ loading }), loading.delay);
        }
        else {
            this.setState({ loading });
        }
    }
    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (this.delayTimeout) {
            clearTimeout(this.delayTimeout);
        }
    }
    render() {
        const _a = this.props, { type, shape, size = '', className, htmlType, children, icon, prefixCls, ghost } = _a, others = __rest(_a, ["type", "shape", "size", "className", "htmlType", "children", "icon", "prefixCls", "ghost"]);
        const { loading, clicked } = this.state;
        // large => lg
        // small => sm
        let sizeCls = '';
        switch (size) {
            case 'large':
                sizeCls = 'lg';
                break;
            case 'small':
                sizeCls = 'sm';
            case 'modal':
                sizeCls = 'md';
            default:
                break;
        }
        const classes = classNames(prefixCls, {
            [`${prefixCls}-${type}`]: type,
            [`${prefixCls}-${shape}`]: shape,
            [`${prefixCls}-${sizeCls}`]: sizeCls,
            [`${prefixCls}-icon-only`]: !children && icon,
            [`${prefixCls}-loading`]: loading,
            [`${prefixCls}-clicked`]: clicked,
            [`${prefixCls}-background-ghost`]: ghost,
        }, className);
        const iconType = loading ? 'loading' : icon;
        const iconNode = iconType ? <Icon type={iconType}/> : null;
        const needInserted = React.Children.count(children) === 1 && !iconType;
        const kids = React.Children.map(children, child => insertSpace(child, needInserted));
        return (<button {...omit(others, ['loading', 'clicked'])} type={htmlType || 'button'} className={classes} onMouseUp={this.handleMouseUp} onClick={this.handleClick}>
        {iconNode}{kids}
      </button>);
    }
}
Button.__ANT_BUTTON = true;
Button.defaultProps = {
    prefixCls: 'ant-btn',
    loading: false,
    clicked: false,
    ghost: false,
};
Button.propTypes = {
    type: PropTypes.string,
    shape: PropTypes.oneOf(['circle', 'circle-outline']),
    size: PropTypes.oneOf(['large', 'default', 'small', 'modal']),
    htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),
    onClick: PropTypes.func,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    className: PropTypes.string,
    icon: PropTypes.string,
};
