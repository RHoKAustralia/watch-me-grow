import cx from "classnames";
import { WithRouterProps } from "next/dist/client/with-router";
import NextLink from "next/link";
import { withRouter } from "next/router";
import { ReactElementLike } from "prop-types";
import { Children, cloneElement, Component } from "react";

interface LinkProps extends WithRouterProps {
  href: string;
  children: ReactElementLike;
  activeClassName?: string;
}

class Link<P extends LinkProps> extends Component<P> {
  public render() {
    const {
      router,
      children,
      href,
      activeClassName,
      ...otherProps
    } = this.props;

    const child: any = Children.only(children);
    const active = this.props.router.pathname === href && activeClassName;
    const className = cx(child.props.className, {
      [activeClassName as string]: active
    });

    return (
      <NextLink href={this.props.href} {...otherProps}>
        {cloneElement(child, { className })}
      </NextLink>
    );
  }
}

export default withRouter(Link);
