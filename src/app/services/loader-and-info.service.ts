import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerOverlayComponentComponent } from '../components/spinner-overlay-component/spinner-overlay-component.component';

@Injectable({
  providedIn: 'root'
})
export class LoaderAndInfoService {

  private declare overlayRef: OverlayRef ;

  constructor(private snackBar: MatSnackBar, private overlay: Overlay) { }

  showMessage(message: string, action: string = 'Close', duration: number = 4000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  showSpinner(): void {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'dark-backdrop',
        positionStrategy: this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically()
      });
    }

    const spinnerPortal = new ComponentPortal(SpinnerOverlayComponentComponent);
    this.overlayRef.attach(spinnerPortal);
  }

  hideSpinner(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }
}
