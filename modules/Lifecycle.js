import React from 'react'
import invariant from 'invariant'

const { object } = React.PropTypes

function getRoute(element) {
  const route = element.props.route || element.context.route

  invariant(
    route,
    'The Lifecycle mixin needs to be used either on 1) a <Route component> or ' +
    '2) a descendant of a <Route component> that uses the RouteContext mixin'
  )

  return route
}

/**
 * The Lifecycle mixin adds the routerWillLeave lifecycle method
 * to a component that may be used to cancel a transition or prompt
 * the user for confirmation.
 *
 * On standard transitions, routerWillLeave receives a single argument: the
 * location we're transitioning to. To cancel the transition, return false.
 * To prompt the user for confirmation, return a prompt message (string).
 *
 * routerWillLeave does not receive a location object during the beforeunload
 * event in web browsers (assuming you're using the useBeforeUnload history
 * enhancer). In this case, it is not possible for us to know the location
 * we're transitioning to so routerWillLeave must return a prompt message to
 * prevent the user from closing the tab.
 */
const Lifecycle = {

  propTypes: {
    // Route components receive the route object as a prop.
    route: object
  },

  contextTypes: {
    history: object.isRequired,
    // Nested children receive the route as context, either
    // set by the route component using the RouteContext mixin
    // or by some other ancestor.
    route: object
  },

  componentWillMount() {
    invariant(
      this.routerWillLeave,
      'The Lifecycle mixin requires you to define a routerWillLeave method'
    )

    this._unlistenBeforeLeavingRoute = this.context.history.listenBeforeLeavingRoute(
      getRoute(this),
      this.routerWillLeave
    )
  },

  componentWillUnmount() {
    if (this._unlistenBeforeLeavingRoute)
      this._unlistenBeforeLeavingRoute()
  }

}

export default Lifecycle
