export interface Params {
  [id: string]: string
}

export interface MatchedRoute {
  route: Route,
  params: Params
}

export class Route {
  constructor(
    public path: string,
    public component: React.ComponentClass<any>,
    public preFilter: (r: Route) => boolean = () => false,
    public children: Route[] = []
  ) { }


  pathParts() {
    if (this.path === '/') return [''];
    const routePart = this.path.split('?')[0]
    return routePart.split('/');
  }

  queryParts() {
    const parts = this.path.split('?');
    if (parts.length > 2) {
      throw Error("Routes may not contain more than one ?")
    } else if (parts.length > 1) {
      return parts[1].split('&');
    } else {
      return [];
    }
  }

  match(remainingRouteParts: string[], queryParams: {[param: string]: string} = {}, incomingParams: Params = {}): MatchedRoute[] | undefined {
    const params = { ...incomingParams };
    const matches = this.routeMatch(remainingRouteParts, params);
    if (!matches) return;
    // Add any query
    this.queryParamMatch(queryParams, params);

    // If we've gotten here, this path is a match; but there may still be
    // unmatched leftovers. Gotta find a child who matches.
    const nextRemainingRouteParts = remainingRouteParts.slice(matches);
    const thisMatch = { route: this, params } as MatchedRoute;

    if (nextRemainingRouteParts.length === 0) {
      return [thisMatch];

      // If there are more parts, recurse!
    } else {
      const child = this.children.find(
        route => !!route.match(nextRemainingRouteParts, queryParams, params)
      )
      if (!child) return;
      const childMatches = child.match(nextRemainingRouteParts, queryParams, params);
      return [thisMatch].concat(childMatches as MatchedRoute[]);
    }
  }

  private queryParamMatch(queryParams: {[param: string]: string}, params: {}) {
    // Assigns query param matches
    const parts = this.queryParts();
    parts.map(part => {
      const match = queryParams[part];
      params[part] = match;
    });
  }

  private routeMatch(remainingRouteParts: string[], params: {}) {
    // Matches if all of this route's parts (the bits with /'s) are present and
    // in order in the actual route. Is unconcerned with query params.
    const myParts = this.pathParts();
    for (var i = 0; i < myParts.length; i++) {
      let match = this.partMatch(myParts[i], remainingRouteParts[i]);
      if (!match) return;
      Object.assign(params, match);
    }
    return myParts.length;
  }

  private partMatch(routePart: string, pathPart: string) {
    if (routePart === pathPart) {
      return {};
    } else if (routePart.startsWith(':')) {
      return { [routePart.slice(1)]: pathPart }
    } else {
      return false
    }
  }
}