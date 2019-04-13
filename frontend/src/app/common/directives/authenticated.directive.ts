import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { IAuthentication } from '../services';

@Directive({
  selector: '[authenticated]'
})
export class AuthenticatedDirective implements OnInit, OnDestroy {
  subscription: Subscription;

  _expectedState: boolean;

  @Input()
  set authenticated(expectedState: boolean) {
    this._expectedState = expectedState;
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: IAuthentication
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.isAuthenticated$
      .pipe(distinctUntilChanged())
      .subscribe(auth => {
        if (auth === this._expectedState) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
