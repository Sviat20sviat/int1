import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CanvasAnimationService {
  private ctx: CanvasRenderingContext2D | null = null;
  private grid: { baseX: number, baseY: number, x: number, y: number }[][] = [];
  private width = 0;
  private height = 0;
  private animationFrameId = 0;
  private isBrowser: boolean;
  private mouse = { x: -1000, y: -1000 };
  private time = 0;
  private isDarkModeFn!: () => boolean;
  private canvas!: HTMLCanvasElement;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private ngZone: NgZone) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  init(canvas: HTMLCanvasElement, isDarkModeFn: () => boolean) {
    if (!this.isBrowser) return;
    this.canvas = canvas;
    this.isDarkModeFn = isDarkModeFn;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.onResize();

    // Run animation outside Angular zone to prevent excessive change detection syncs
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  destroy() {
    if (this.isBrowser && this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  onMouseMove(event: MouseEvent) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  onMouseOut() {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  onResize() {
    if (this.canvas && this.isBrowser) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.createGrid();
    }
  }

  private createGrid() {
    this.grid = [];
    const spacing = 55;
    const cols = Math.ceil(this.width / spacing) + 2;
    const rows = Math.ceil(this.height / spacing) + 2;

    for (let i = -1; i < cols; i++) {
      const col = [];
      for (let j = -1; j < rows; j++) {
        col.push({
          baseX: i * spacing,
          baseY: j * spacing,
          x: i * spacing,
          y: j * spacing,
        });
      }
      this.grid.push(col);
    }
  }

  private animate = () => {
    if (!this.ctx) return;
    this.time += 0.01;

    // Clear canvas with solid color
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = this.isDarkModeFn() ? '#080808ff' : '#ebebebff';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const mouseX = this.mouse.x;
    const mouseY = this.mouse.y;
    const gravityRadius = 800;
    const gravityStrength = 320; // How many pixels they get pulled

    // Calculate physics
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let p = this.grid[i][j];

        // Wavy oscillation (increased amplitude)
        let targetX = p.baseX + Math.sin(this.time + p.baseX * 0.01 + p.baseY * 0.01) * 20;
        let targetY = p.baseY + Math.cos(this.time + p.baseX * 0.01 - p.baseY * 0.01) * 20;

        // Mouse gravity
        let dx = mouseX - p.baseX;
        let dy = mouseY - p.baseY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < gravityRadius && mouseX !== -1000) {
          let force = (gravityRadius - distance) / gravityRadius;
          force = force * force * force; // Cubic easing for stronger center pull, gradual falloff
          if (distance > 0) {
            targetX += (dx / distance) * force * gravityStrength;
            targetY += (dy / distance) * force * gravityStrength;
          }
        }

        // Spring to target (easing)
        p.x += (targetX - p.x) * 0.15;
        p.y += (targetY - p.y) * 0.15;
      }
    }

    // Draw the points (neon cyan for dark, bright hot pink for light)
    this.ctx.fillStyle = this.isDarkModeFn() ? 'rgba(20, 168, 15, 0.8)' : 'rgba(19, 220, 255, 0.9)';
    this.ctx.shadowBlur = 6;
    this.ctx.shadowColor = this.isDarkModeFn() ? 'rgba(20, 168, 15, 0.8)' : 'rgba(255, 200, 19, 0.9)';

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let p = this.grid[i][j];

        // Draw the point
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  }
}
