import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
  styleUrl: './motion.component.scss'
})
export class MotionComponent implements OnInit, OnDestroy {
  
  stepCount: number = 0;
  isStepDetected: boolean = false;

  constructor(private motionS: MotionService, private cdRef: ChangeDetectorRef) {}

  motionData: MotionData = {stepCount: 0, isStepDetected: false};

  ngOnInit(): void {
    this.motionS.startMotionDetection(async (data: MotionData) => {
      console.log('Motion data received:', data);
        this.motionData = data;
        this.stepCount = data.stepCount || 0; // Use the stepCount from the data or default to 0

        if (data.isStepDetected) {
          this.isStepDetected = true;
          this.cdRef.detectChanges(); // Manually trigger change detection
          await this.delay(500); // Wait for 500 milliseconds
          this.isStepDetected = false;
          this.cdRef.detectChanges(); // Manually trigger change detection
        } else {
          this.isStepDetected = false;
          this.cdRef.detectChanges(); // Manually trigger change detection
        }
    });
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }

  resetSteps() {
    this.stepCount = 0;
    this.motionData.stepCount = 0;
    this.cdRef.detectChanges();
    console.log('Steps reset to zero.');
  }
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}