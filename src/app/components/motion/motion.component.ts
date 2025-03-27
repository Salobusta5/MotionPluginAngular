import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(private motionS: MotionService) {}

  motionData: MotionData = {};

  ngOnInit(): void {
    this.motionS.startMotionDetection((data: MotionData) => {
        this.motionData = data;
        this.stepCount = data.stepCount || 0; // Use the stepCount from the data or default to 0
        this.isStepDetected = data.isStepDetected || false; // Update isStepDetected based on data
    });
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }
}