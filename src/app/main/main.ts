import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, Inject, PLATFORM_ID, OnDestroy, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { CanvasAnimationService } from './canvas-animation.service';
import { ThemeService } from '../theme.service';
import { HeaderComponent } from "../header/header";

@Component({
  selector: 'main',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private isBrowser: boolean;
  themeService = inject(ThemeService);

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private canvasAnimation: CanvasAnimationService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser && this.canvasRef) {
      this.canvasAnimation.init(this.canvasRef.nativeElement, () => this.themeService.isDarkMode());
    }
  }

  ngOnDestroy() {
    this.canvasAnimation.destroy();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.canvasAnimation.onMouseMove(event);
  }

  @HostListener('window:mouseout')
  onMouseOut() {
    this.canvasAnimation.onMouseOut();
  }

  @HostListener('window:resize')
  onResize() {
    this.canvasAnimation.onResize();
  }
}
