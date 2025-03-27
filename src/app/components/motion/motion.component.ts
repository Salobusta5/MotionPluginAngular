import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
  styleUrl: './motion.component.scss'
})
export class MotionComponent implements OnInit, OnDestroy{

  stepCount: number = 0;
  motionData: MotionData = {stepCount: 0, isStepDetected: false};
  isStepDetected: boolean = false;
  inclinationAngle: number = 0; 

  private inclinationSubscription: Subscription | undefined;
  private stepDetectionSubscription: Subscription | undefined;

  constructor(private motionS: MotionService) { }

  ngOnInit(): void {
    this.inclinationSubscription = this.motionS.inclinationAngle$.subscribe(angle => {
      this.inclinationAngle = angle;
    });

    this.stepDetectionSubscription = this.motionS.motionData$.subscribe((data: MotionData) => {
        this.motionData = data;
    });
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }
}
