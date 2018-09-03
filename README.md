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

### Links

`Link` is a component that creates a history-tracking SPA-style link. A Link is required to have a `to` attribute, which names the path to transition to.

```
<Link to="org/billing">Billing</Link>
```

#### Optional params
* `query`: an object, mapping query params to values 
* `state`: any type; state is invisible to the URL, and so not tracked when bookmarked, shared, etc
* `className`: a string; these classes are always attached to the link
* `activeClassName`: a string; these classes are present when the current page is the linked-to page, in addition to those classes in className
* `replaceHistory`: a boolean. When true/present, the linked-to page will replace the current page in history; the back button will skip the current page once the link is clicked.
* `beforeGo`: A function of zero arguments. Is called after the link is clicked but before the link is followed. Not called when link is opened in new tab.
* `style`: CSSProperties.
* `tabIndex`: A number.
* `role`: A string. For a11y.
* `target`: string. Just like any \<a> tag.
* `title`: string.

## Example usage

See [Vistimo](https://www.vistimo.com) for a complicated use-case.
