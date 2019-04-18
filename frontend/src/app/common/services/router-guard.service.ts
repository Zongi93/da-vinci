import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService } from 'src/app/pages/table';
import { IAuthentication } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RouterGuardService implements CanActivate {
  subscription: Subscription;

  constructor(
    private router: Router,
    private authenticationService: IAuthentication,
    private tableService: TableService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requestedGuards = Object.keys(route.data).map(
      key => route.data[key] as Guard
    );
    /*
    console.log({ 'requested route': route });

    console.log({ 'requested guards': requestedGuards }); */

    const observables = requestedGuards.map(guard =>
      this.withGuard(this.resolveGuardState(guard, route), guard)
    );

    const combined = combineLatest(observables);

    this.subscription = combined.subscribe(results =>
      this.checkGuardResults(results)
    );

    return combined.pipe(
      map(guards => guards.every(guarded => guarded.result))
    );
  }

  private resolveGuardState(
    guard: Guard,
    route: ActivatedRouteSnapshot
  ): Observable<boolean> {
    switch (guard) {
      case Guard.AUTHENTICATED:
        return this.authenticationService.isAuthenticated$;

      case Guard.NOT_AUTHENTICATED:
        return of(!this.authenticationService.isAuthenticated());

      case Guard.HAS_ACCESS_TOKEN:
        return this.tableService.validateUrl();
    }
  }

  private routeToFailedGuardHandler(failedGuard: Guard): void {
    switch (failedGuard) {
      case Guard.AUTHENTICATED:
        this.router.navigate(['list']);
        break;

      case Guard.NOT_AUTHENTICATED:
        this.router.navigate(['list']);
        break;

      case Guard.HAS_ACCESS_TOKEN:
        this.router.navigate(['list']);
    }
  }

  private checkGuardResults(results: Array<GuardResult>): void {
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
    const failedGuards = results.filter(requirement => !requirement.result);

    if (failedGuards.length > 0) {
      this.routeToFailedGuardHandler(failedGuards[0].guard);
    }
  }

  private withGuard(
    observable: Observable<boolean>,
    guard: Guard
  ): Observable<GuardResult> {
    return observable.pipe(map(result => new GuardResult(result, guard)));
  }
}

export enum Guard {
  AUTHENTICATED,
  NOT_AUTHENTICATED,
  HAS_ACCESS_TOKEN
}

export class GuardResult {
  result: boolean;
  guard: Guard;

  constructor(result: boolean, guard: Guard) {
    this.result = result;
    this.guard = guard;
  }
}
