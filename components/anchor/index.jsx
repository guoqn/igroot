import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import AnchorLink from './AnchorLink';
import Affix from '../affix';
import AnchorHelper, { getDefaultTarget } from './anchorHelper';
export default class Anchor extends React.Component {
    constructor(props) {
        super(props);
        this.handleScroll = () => {
            this.setState({
                activeAnchor: this.anchorHelper.getCurrentAnchor(this.props.offsetTop, this.props.bounds),
            });
        };
        this.updateInk = () => {
            const activeAnchor = this.anchorHelper.getCurrentActiveAnchor();
            if (activeAnchor) {
                this.refs.ink.style.top = `${activeAnchor.offsetTop + activeAnchor.clientHeight / 2 - 4.5}px`;
            }
        };
        this.clickAnchorLink = (href, component) => {
            this._avoidInk = true;
            this.refs.ink.style.top = `${component.offsetTop + component.clientHeight / 2 - 4.5}px`;
            this.anchorHelper.scrollTo(href, this.props.offsetTop, getDefaultTarget, () => {
                this._avoidInk = false;
            });
        };
        this.renderAnchorLink = (child) => {
            const { href } = child.props;
            const { type } = child;
            if (type.__ANT_ANCHOR_LINK && href) {
                this.anchorHelper.addLink(href);
                return React.cloneElement(child, {
                    onClick: this.clickAnchorLink,
                    prefixCls: this.props.prefixCls,
                    bounds: this.props.bounds,
                    affix: this.props.affix || this.props.showInkInFixed,
                    offsetTop: this.props.offsetTop,
                });
            }
            return child;
        };
        this.state = {
            activeAnchor: null,
            animated: true,
        };
        this.anchorHelper = new AnchorHelper();
    }
    getChildContext() {
        return {
            anchorHelper: this.anchorHelper,
        };
    }
    componentDidMount() {
        this.handleScroll();
        this.updateInk();
        this.scrollEvent = addEventListener((this.props.target || getDefaultTarget)(), 'scroll', this.handleScroll);
    }
    componentWillUnmount() {
        if (this.scrollEvent) {
            this.scrollEvent.remove();
        }
    }
    componentDidUpdate() {
        if (!this._avoidInk) {
            this.updateInk();
        }
    }
    render() {
        const { prefixCls, offsetTop, style, className = '', affix, showInkInFixed } = this.props;
        const { activeAnchor, animated } = this.state;
        const inkClass = classNames({
            [`${prefixCls}-ink-ball`]: true,
            animated,
            visible: !!activeAnchor,
        });
        const wrapperClass = classNames({
            [`${prefixCls}-wrapper`]: true,
        }, className);
        const anchorClass = classNames(prefixCls, {
            'fixed': !affix && !showInkInFixed,
        });
        const anchorContent = (<div className={wrapperClass} style={style}>
        <div className={anchorClass}>
          <div className={`${prefixCls}-ink`}>
            <span className={inkClass} ref="ink"/>
          </div>
          {React.Children.toArray(this.props.children).map(this.renderAnchorLink)}
        </div>
      </div>);
        return !affix ? anchorContent : (<Affix offsetTop={offsetTop}>
        {anchorContent}
      </Affix>);
    }
}
Anchor.Link = AnchorLink;
Anchor.defaultProps = {
    prefixCls: 'ant-anchor',
    affix: true,
    showInkInFixed: false,
};
Anchor.childContextTypes = {
    anchorHelper: PropTypes.any,
};