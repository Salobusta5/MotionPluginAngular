import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import { MotionData } from '../Model/MotionData.model';



@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private accelListener?: PluginListenerHandle;
  private stepCount: number = 0;
  private lastAccelData: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  private stepThreshold: number = 0.8; // Adjust this value based on testing
  private stepTimeout: number = 300; // Adjust this value based on testing
  private lastStepTime: number = 0;
  private motionData: MotionData = {};

  constructor() {}

  async startMotionDetection(callback: (data: MotionData) => void) {
    this.accelListener = await Motion.addListener('accel', (event) => {
      this.processAccelerationData(event.acceleration);
      this.motionData.acceleration = event.acceleration;
      this.motionData.stepCount = this.stepCount;
      callback(this.motionData);
    });
  }

  async stopMotionDetection() {
    if (this.accelListener) {
      await this.accelListener.remove();
      this.accelListener = undefined;
      this.resetStepCount();
    }
  }

  private processAccelerationData(acceleration: { x: number; y: number; z: number }) {
    const currentTime = Date.now();

    if (this.isStep(acceleration)) {
      if (currentTime - this.lastStepTime > this.stepTimeout) {
        this.stepCount++;
        this.lastStepTime = currentTime;
        console.log(`Step detected! Count: ${this.stepCount}`);
      }
    }
    this.lastAccelData = {
      x: acceleration.x,
      y: acceleration.y,
      z: acceleration.z,
    };
  }

  private isStep(acceleration: { x: number; y: number; z: number }): boolean {
    const deltaX = Math.abs(acceleration.x - this.lastAccelData.x);
    const deltaY = Math.abs(acceleration.y - this.lastAccelData.y);
    const deltaZ = Math.abs(acceleration.z - this.lastAccelData.z);

    const movementMagnitude = Math.sqrt(
      Math.pow(deltaX, 2) + Math.pow(deltaY, 2) + Math.pow(deltaZ, 2)
    );

    if (movementMagnitude > this.stepThreshold) {
      // Check the difference between the current and the last magnitude
      const currentMagnitude = Math.sqrt(Math.pow(acceleration.x, 2) + Math.pow(acceleration.y, 2) + Math.pow(acceleration.z, 2));
      const lastMagnitude = Math.sqrt(Math.pow(this.lastAccelData.x, 2) + Math.pow(this.lastAccelData.y, 2) + Math.pow(this.lastAccelData.z, 2));
      const diffMagnitude = Math.abs(currentMagnitude - lastMagnitude);
      return diffMagnitude > 0.3; // You may need to adjust this value
    }
    return false;
  }

  private resetStepCount() {
    this.stepCount = 0;
    this.lastStepTime = 0;
  }
}
