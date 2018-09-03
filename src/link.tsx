import * as React from "react";
import { go, isActive, whereTo } from "utils";
import { history } from "rt-history";

export interface LinkProps {
  to: string;
  query?: { [id: string]: string };
  state?: any;
  style?: React.CSSProperties;
  className?: string;
  activeClassName?: string;
  replaceHistory?: boolean;
  tabIndex?: number;
  role?: string;
  beforeGo?: () => void;
  target?: string;
  title?: string;
}

export class Link extends React.Component<LinkProps, {}> {
  state: { active: false };
  link: HTMLAnchorElement;
  newFocus = false;
  unlisten: () => void;

  componentWillMount() {
    if (this.props.activeClassName) {
      const updateActive = () => {
        this.setState({
          active: isActive(this.props.to, {
            query: this.props.query,
            state: this.props.state
          })
        });
      };
      this.unlisten = history.listen(updateActive);
    }
  }

  componentWillUnmount() {
    if (this.unlisten) this.unlisten();
  }

  go() {
    if (this.props.beforeGo && this.props.beforeGo()) return;
    go(
      this.props.to,
      {
        query: this.props.query,
        state: this.props.state
      },
      this.props.replaceHistory
    );
  }

  active() {
    return isActive(this.props.to, {
      query: this.props.query,
      state: this.props.state
    });
  }

  remoteLink() {
    return this.props.to.match(/\:/);
  }

  onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (this.remoteLink()) return;
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
    e.preventDefault();
    this.go();
  };

  render() {
    const to = whereTo(this.props.to);
    return (
      <a
        style={this.props.style}
        className={`routree-link ${
          this.state.active ? this.props.activeClassName : ""
        } ${this.props.className}`}
        tabIndex={this.props.tabIndex || 0}
        onClick={this.onClick}
        target={this.props.target}
        role={this.props.role}
        href={to ? to.pathname : ""}
        title={this.props.title}
      >
        {this.props.children}
      </a>
    );
  }
}
