# Routree: Yet another react routing library

Nothing too special here, just simple and convenient. Just a rails/angular-ui-router inspired router for react. There are many like it, but this one is mine.

## Installing

`yarn add routree` or `npm install routree`.

Routree comes with typescript typings; no need to install them separately.

## Usage

Routree defines all the routes in an app in one object, associating each path to a component. Nested paths create nested components; (but paths that appear nested to the user needn't be nested in reality).

```javascript
import { go, history, Router } from 'routree';

// If using typescript, routes should have type `RouteDeclaration`
const routes = {
  path: '/',
  children: [
    // Each route has at least a path and a component; the component 
    // will be shown when the patch is matched.
    { path: 'login', component: Login },
    { path: 'forgotten_password', component: ForgotPassword },

    // Routes can have children; an active child route is rendered as
    // a child element of the parent routes component (parent components
    // must use `this.props.children`). Routes with children but no 
    // component will render their active child directly.
    { path: 'settings/:organizationId/:projectId', component: Settings, preFilter: requireLogin, children: [
      { path: 'org/users', component: OrganizationUserSettings },

      // Routes can have parameters, which begin with a :. They will be
      // passed to the component as props.
      { path: 'org/user/:userId', component: OrganizationUserSettings },

      // Routes can also have query params; these, too, will be passed in 
      // as props.
      { path: 'org/billing?paymentType', component: BillingSettings },

    ]},

    // Routes can take a pre-filter function, which is called *before* the 
    // transition into the route takes place. 
    { path: 'project-list', component: ProjectList,   preFilter: requireLogin }
  ],
};

// If a pre-filter returns true, routree assumes it has triggered a redirect, and does not complete the transition.
function requireLogin() {
  if (userLoggedIn()) return false;
  go('/login', { state: { from: history.location } });
  return true;
}

// Use the Router component to render the correct component given the current URL.
class App extends React.Component {
  render() {
    return <Router routes={routes} notFound={<Custom404Component />} />
  }
}
```

## Example usage

See [Vistimo](https://www.vistimo.com) for a complicated use-case.
