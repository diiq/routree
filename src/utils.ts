import { history } from './rt-history';
import { LocationDescriptorObject } from 'history';

export interface Params {
  [id: string]: string
}

export interface LinkOptions {
  query?: Params,
  search?: string,
  state?: {},
  location?: string,
}

export function go(pathname: string, options?: LinkOptions, replace = false): void {
  const newLocation = whereTo(pathname, options);
  if (!newLocation) return;
  if (replace) {
    history.replace(newLocation);
  } else {
    history.push(newLocation);
  }
}

export function whereTo(pathname: string, options: LinkOptions = {}): LocationDescriptorObject | undefined {
  var { query, search, state, location } = options;
  location = location || '';
  search = search || (query ? '?' : '');
  if (query != undefined) {
    search = search + Object.keys(query).map(k => `${k}=${query && query[k]}`).join('&');
  }

  if (pathname.startsWith('/')) {
    return { pathname, state, search };
  }

  if (!pathname.startsWith('.')) {
    return { pathname: location + pathname, state, search };
  }

  location = location || history.location.pathname.replace(/[^\/]*$/, '')

  if (pathname.startsWith('./')) {
    return whereTo(pathname.slice(2), { query, state, location });
  }

  if (pathname.startsWith('../')) {
    pathname = pathname.slice(3);
    return whereTo(pathname, { query, state, location: location.replace(/[^\/]*\/$/, '') })
  }
}

export function isActive(pathname: string, options?: LinkOptions) {
  const going = whereTo(pathname, options);
  if (!going) return false;
  return (
    history.location.pathname == going.pathname &&
    history.location.search == going.search &&
    history.location.state == going.state // TODO this comparison may fail
  );
}
