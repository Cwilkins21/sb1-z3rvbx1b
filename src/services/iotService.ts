import { IoTDevice, Sensor, SensorReading, DeviceStatus } from '../types';

export class IoTService {
  private devices: Map<string, IoTDevice> = new Map();
  private sensorReadings: Map<string, SensorReading[]> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeIoT();
  }

  private async initializeIoT() {
    // Initialize IoT connectivity
    await this.setupDeviceDiscovery();
    await this.startDataCollection();
    await this.initializeEdgeComputing();
  }

  // Device Management
  async registerDevice(deviceConfig: {
    type: 'camera' | 'sensor' | 'beacon' | 'scanner' | 'display' | 'printer' | 'gateway' | 'vehicle-unit';
    location: { lat: number; lng: number; address?: string };
    sensors: Array<{
      type: 'temperature' | 'humidity' | 'pressure' | 'motion' | 'proximity' | 'gps' | 'accelerometer' | 'camera' | 'microphone';
      unit: string;
      range: [number, number];
      accuracy: number;
    }>;
    connectivity: {
      type: 'wifi' | 'cellular' | 'bluetooth' | 'lora' | 'zigbee';
      strength: number;
      protocol: string;
    };
  }): Promise<IoTDevice> {
    const device: IoTDevice = {
      id: crypto.randomUUID(),
      type: deviceConfig.type,
      location: deviceConfig.location,
      status: 'online',
      sensors: deviceConfig.sensors.map(sensorConfig => ({
        id: crypto.randomUUID(),
        type: sensorConfig.type,
        unit: sensorConfig.unit,
        range: sensorConfig.range,
        accuracy: sensorConfig.accuracy,
        lastReading: {
          id: crypto.randomUUID(),
          value: 0,
          timestamp: new Date(),
          quality: 'good',
          metadata: {}
        },
        calibration: {
          lastCalibrated: new Date(),
          nextCalibration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          offset: 0,
          scale: 1
        }
      })),
      connectivity: {
        type: deviceConfig.connectivity.type,
        strength: deviceConfig.connectivity.strength,
        protocol: deviceConfig.connectivity.protocol,
        lastSeen: new Date(),
        dataUsage: 0
      },
      firmware: {
        version: '1.0.0',
        lastUpdate: new Date(),
        updateAvailable: false,
        autoUpdate: true
      },
      security: {
        encrypted: true,
        certificateExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        lastSecurityScan: new Date(),
        vulnerabilities: []
      }
    };

    this.devices.set(device.id, device);
    this.sensorReadings.set(device.id, []);
    
    // Start monitoring device
    this.startDeviceMonitoring(device);
    
    return device;
  }

  async getDevices(filters?: {
    type?: string;
    status?: DeviceStatus;
    location?: { lat: number; lng: number; radius: number };
  }): Promise<IoTDevice[]> {
    let devices = Array.from(this.devices.values());

    if (filters) {
      if (filters.type) {
        devices = devices.filter(device => device.type === filters.type);
      }
      if (filters.status) {
        devices = devices.filter(device => device.status === filters.status);
      }
      if (filters.location) {
        devices = devices.filter(device => 
          this.calculateDistance(device.location, filters.location!) <= filters.location!.radius
        );
      }
    }

    return devices;
  }

  // Smart City Sensors
  async deployTrafficSensors(intersections: Array<{ lat: number; lng: number; name: string }>): Promise<IoTDevice[]> {
    const trafficDevices = [];

    for (const intersection of intersections) {
      const device = await this.registerDevice({
        type: 'sensor',
        location: intersection,
        sensors: [
          { type: 'camera', unit: 'fps', range: [0, 60], accuracy: 0.95 },
          { type: 'motion', unit: 'vehicles/min', range: [0, 100], accuracy: 0.9 },
          { type: 'proximity', unit: 'meters', range: [0, 50], accuracy: 0.8 }
        ],
        connectivity: {
          type: 'cellular',
          strength: 85,
          protocol: '5G'
        }
      });

      trafficDevices.push(device);
    }

    return trafficDevices;
  }

  async deployParkingSensors(parkingSpots: Array<{ lat: number; lng: number; spotId: string }>): Promise<IoTDevice[]> {
    const parkingDevices = [];

    for (const spot of parkingSpots) {
      const device = await this.registerDevice({
        type: 'sensor',
        location: spot,
        sensors: [
          { type: 'proximity', unit: 'occupied', range: [0, 1], accuracy: 0.95 },
          { type: 'camera', unit: 'fps', range: [0, 30], accuracy: 0.9 }
        ],
        connectivity: {
          type: 'lora',
          strength: 75,
          protocol: 'LoRaWAN'
        }
      });

      parkingDevices.push(device);
    }

    return parkingDevices;
  }

  async deployEnvironmentalSensors(locations: Array<{ lat: number; lng: number; type: 'air-quality' | 'noise' | 'weather' }>): Promise<IoTDevice[]> {
    const environmentalDevices = [];

    for (const location of locations) {
      const sensors = this.getEnvironmentalSensors(location.type);
      
      const device = await this.registerDevice({
        type: 'sensor',
        location,
        sensors,
        connectivity: {
          type: 'wifi',
          strength: 80,
          protocol: 'WiFi 6'
        }
      });

      environmentalDevices.push(device);
    }

    return environmentalDevices;
  }

  // Real-time Data Collection
  async startDataCollection(): Promise<void> {
    // Simulate real-time data collection
    setInterval(async () => {
      for (const device of this.devices.values()) {
        if (device.status === 'online') {
          await this.collectSensorData(device);
        }
      }
    }, 5000); // Collect data every 5 seconds
  }

  private async collectSensorData(device: IoTDevice): Promise<void> {
    for (const sensor of device.sensors) {
      const reading = await this.generateSensorReading(sensor, device);
      
      // Store reading
      const deviceReadings = this.sensorReadings.get(device.id) || [];
      deviceReadings.push(reading);
      
      // Keep only last 1000 readings per device
      if (deviceReadings.length > 1000) {
        deviceReadings.splice(0, deviceReadings.length - 1000);
      }
      
      this.sensorReadings.set(device.id, deviceReadings);
      
      // Update sensor's last reading
      sensor.lastReading = reading;
      
      // Trigger events for anomalies or thresholds
      await this.processReading(device, sensor, reading);
    }
  }

  private async generateSensorReading(sensor: Sensor, device: IoTDevice): Promise<SensorReading> {
    const baseValue = this.getBaseValueForSensor(sensor.type, device.location);
    const noise = (Math.random() - 0.5) * 0.1; // 10% noise
    const value = Math.max(sensor.range[0], Math.min(sensor.range[1], baseValue + noise));

    return {
      id: crypto.randomUUID(),
      value,
      timestamp: new Date(),
      quality: this.assessDataQuality(value, sensor),
      metadata: {
        deviceId: device.id,
        sensorType: sensor.type,
        location: device.location,
        connectivity: device.connectivity.strength
      }
    };
  }

  // Smart Analytics & Alerts
  private async processReading(device: IoTDevice, sensor: Sensor, reading: SensorReading): Promise<void> {
    // Check for anomalies
    const isAnomaly = await this.detectAnomaly(device.id, sensor.id, reading);
    if (isAnomaly) {
      await this.triggerAlert('anomaly', {
        deviceId: device.id,
        sensorId: sensor.id,
        reading,
        severity: 'medium'
      });
    }

    // Check thresholds
    const thresholdViolation = this.checkThresholds(sensor, reading);
    if (thresholdViolation) {
      await this.triggerAlert('threshold', {
        deviceId: device.id,
        sensorId: sensor.id,
        reading,
        threshold: thresholdViolation,
        severity: thresholdViolation.severity
      });
    }

    // Trigger custom event handlers
    await this.triggerEventHandlers(`sensor:${sensor.type}`, {
      device,
      sensor,
      reading
    });
  }

  // Predictive Maintenance
  async predictMaintenanceNeeds(): Promise<Array<{
    deviceId: string;
    component: string;
    probability: number;
    timeToFailure: number;
    recommendedAction: string;
  }>> {
    const predictions = [];

    for (const device of this.devices.values()) {
      // Analyze device health metrics
      const healthScore = await this.calculateDeviceHealth(device);
      
      if (healthScore < 0.8) {
        predictions.push({
          deviceId: device.id,
          component: 'sensor-array',
          probability: 1 - healthScore,
          timeToFailure: this.estimateTimeToFailure(healthScore),
          recommendedAction: this.getMaintenanceRecommendation(healthScore)
        });
      }
    }

    return predictions;
  }

  // Edge Computing & Local Processing
  async deployEdgeFunction(deviceId: string, functionCode: string, triggers: string[]): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) throw new Error('Device not found');

    // Deploy function to edge device
    console.log(`Deploying edge function to device ${deviceId}`);
    
    // Register triggers
    for (const trigger of triggers) {
      this.addEventListener(trigger, async (event) => {
        await this.executeEdgeFunction(deviceId, functionCode, event);
      });
    }
  }

  private async executeEdgeFunction(deviceId: string, functionCode: string, event: any): Promise<void> {
    // Execute function on edge device
    console.log(`Executing edge function on device ${deviceId}`);
    
    try {
      // Simulate edge processing
      const result = await this.processAtEdge(functionCode, event);
      
      // Send result back if needed
      if (result.sendToCloud) {
        await this.sendToCloud(deviceId, result.data);
      }
    } catch (error) {
      console.error('Edge function execution failed:', error);
    }
  }

  // Device Security & Updates
  async performSecurityScan(deviceId: string): Promise<{
    vulnerabilities: Array<{
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      cve?: string;
      mitigation: string;
    }>;
    score: number;
    recommendations: string[];
  }> {
    const device = this.devices.get(deviceId);
    if (!device) throw new Error('Device not found');

    // Simulate security scan
    const vulnerabilities = await this.scanForVulnerabilities(device);
    const score = this.calculateSecurityScore(vulnerabilities);
    const recommendations = this.generateSecurityRecommendations(vulnerabilities);

    // Update device security info
    device.security.lastSecurityScan = new Date();
    device.security.vulnerabilities = vulnerabilities;

    return {
      vulnerabilities,
      score,
      recommendations
    };
  }

  async updateDeviceFirmware(deviceId: string, version?: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) throw new Error('Device not found');

    const targetVersion = version || await this.getLatestFirmwareVersion(device.type);
    
    console.log(`Updating device ${deviceId} firmware to ${targetVersion}`);
    
    // Simulate firmware update
    await this.performFirmwareUpdate(device, targetVersion);
    
    device.firmware.version = targetVersion;
    device.firmware.lastUpdate = new Date();
    device.firmware.updateAvailable = false;
  }

  // Event System
  addEventListener(eventType: string, handler: Function): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  private async triggerEventHandlers(eventType: string, data: any): Promise<void> {
    const handlers = this.eventHandlers.get(eventType) || [];
    for (const handler of handlers) {
      try {
        await handler(data);
      } catch (error) {
        console.error(`Event handler error for ${eventType}:`, error);
      }
    }
  }

  // Helper Methods
  private async setupDeviceDiscovery(): Promise<void> {
    // Setup automatic device discovery
    console.log('Setting up IoT device discovery...');
  }

  private async initializeEdgeComputing(): Promise<void> {
    // Initialize edge computing capabilities
    console.log('Initializing edge computing...');
  }

  private startDeviceMonitoring(device: IoTDevice): void {
    // Start monitoring device health and connectivity
    setInterval(async () => {
      await this.checkDeviceHealth(device);
    }, 30000); // Check every 30 seconds
  }

  private async checkDeviceHealth(device: IoTDevice): Promise<void> {
    // Simulate device health check
    const isOnline = Math.random() > 0.05; // 95% uptime
    device.status = isOnline ? 'online' : 'offline';
    
    if (isOnline) {
      device.connectivity.lastSeen = new Date();
    }
  }

  private calculateDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
    // Calculate distance between two coordinates (simplified)
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private getEnvironmentalSensors(type: string): any[] {
    const sensorConfigs = {
      'air-quality': [
        { type: 'temperature', unit: '°C', range: [-20, 50], accuracy: 0.5 },
        { type: 'humidity', unit: '%', range: [0, 100], accuracy: 2 },
        { type: 'pressure', unit: 'hPa', range: [900, 1100], accuracy: 1 }
      ],
      'noise': [
        { type: 'microphone', unit: 'dB', range: [30, 120], accuracy: 1 }
      ],
      'weather': [
        { type: 'temperature', unit: '°C', range: [-40, 60], accuracy: 0.1 },
        { type: 'humidity', unit: '%', range: [0, 100], accuracy: 1 },
        { type: 'pressure', unit: 'hPa', range: [800, 1200], accuracy: 0.5 }
      ]
    };

    return sensorConfigs[type] || [];
  }

  private getBaseValueForSensor(type: string, location: any): number {
    // Generate realistic base values based on sensor type and location
    const baseValues = {
      temperature: 20 + Math.sin(Date.now() / 86400000) * 10, // Daily temperature cycle
      humidity: 50 + Math.random() * 30,
      pressure: 1013 + Math.random() * 20 - 10,
      motion: Math.random() * 50,
      proximity: Math.random() > 0.7 ? 1 : 0, // 30% occupancy
      camera: 30,
      microphone: 40 + Math.random() * 40
    };

    return baseValues[type] || Math.random() * 100;
  }

  private assessDataQuality(value: number, sensor: Sensor): 'excellent' | 'good' | 'fair' | 'poor' {
    // Assess data quality based on sensor characteristics
    const withinRange = value >= sensor.range[0] && value <= sensor.range[1];
    const accuracy = sensor.accuracy;

    if (withinRange && accuracy > 0.9) return 'excellent';
    if (withinRange && accuracy > 0.8) return 'good';
    if (withinRange && accuracy > 0.6) return 'fair';
    return 'poor';
  }

  private async detectAnomaly(deviceId: string, sensorId: string, reading: SensorReading): Promise<boolean> {
    // Simple anomaly detection - in production, use ML models
    const readings = this.sensorReadings.get(deviceId) || [];
    const recentReadings = readings.slice(-10); // Last 10 readings
    
    if (recentReadings.length < 5) return false;
    
    const average = recentReadings.reduce((sum, r) => sum + r.value, 0) / recentReadings.length;
    const stdDev = Math.sqrt(
      recentReadings.reduce((sum, r) => sum + Math.pow(r.value - average, 2), 0) / recentReadings.length
    );
    
    return Math.abs(reading.value - average) > 2 * stdDev;
  }

  private checkThresholds(sensor: Sensor, reading: SensorReading): any {
    // Define thresholds for different sensor types
    const thresholds = {
      temperature: { min: -10, max: 40, severity: 'medium' },
      humidity: { min: 20, max: 80, severity: 'low' },
      motion: { min: 0, max: 80, severity: 'high' },
      microphone: { min: 0, max: 85, severity: 'medium' }
    };

    const threshold = thresholds[sensor.type];
    if (!threshold) return null;

    if (reading.value < threshold.min || reading.value > threshold.max) {
      return threshold;
    }

    return null;
  }

  private async triggerAlert(type: string, data: any): Promise<void> {
    // Trigger system alert
    console.log(`IoT Alert [${type}]:`, data);
    
    // In production, integrate with notification system
    await this.triggerEventHandlers(`alert:${type}`, data);
  }

  private async calculateDeviceHealth(device: IoTDevice): Promise<number> {
    // Calculate overall device health score
    let score = 1.0;

    // Connectivity health
    const timeSinceLastSeen = Date.now() - device.connectivity.lastSeen.getTime();
    if (timeSinceLastSeen > 300000) score -= 0.2; // 5 minutes

    // Sensor health
    const failingSensors = device.sensors.filter(s => s.lastReading.quality === 'poor').length;
    score -= (failingSensors / device.sensors.length) * 0.3;

    // Security health
    const criticalVulns = device.security.vulnerabilities.filter(v => v.severity === 'critical').length;
    score -= criticalVulns * 0.1;

    return Math.max(0, score);
  }

  private estimateTimeToFailure(healthScore: number): number {
    // Estimate time to failure in hours based on health score
    return Math.max(1, (healthScore * 720)); // 0-30 days
  }

  private getMaintenanceRecommendation(healthScore: number): string {
    if (healthScore < 0.3) return 'Immediate replacement required';
    if (healthScore < 0.5) return 'Schedule maintenance within 24 hours';
    if (healthScore < 0.7) return 'Schedule maintenance within 1 week';
    return 'Monitor closely';
  }

  private async processAtEdge(functionCode: string, event: any): Promise<any> {
    // Simulate edge processing
    return {
      processed: true,
      sendToCloud: Math.random() > 0.8, // Send 20% of results to cloud
      data: { ...event, processedAt: 'edge', timestamp: new Date() }
    };
  }

  private async sendToCloud(deviceId: string, data: any): Promise<void> {
    // Send processed data to cloud
    console.log(`Sending edge-processed data from device ${deviceId} to cloud`);
  }

  private async scanForVulnerabilities(device: IoTDevice): Promise<any[]> {
    // Simulate vulnerability scan
    const vulnerabilities = [];
    
    if (Math.random() > 0.8) {
      vulnerabilities.push({
        severity: 'medium',
        description: 'Outdated firmware version',
        mitigation: 'Update to latest firmware version'
      });
    }
    
    return vulnerabilities;
  }

  private calculateSecurityScore(vulnerabilities: any[]): number {
    let score = 100;
    vulnerabilities.forEach(vuln => {
      const penalties = { low: 5, medium: 15, high: 30, critical: 50 };
      score -= penalties[vuln.severity] || 0;
    });
    return Math.max(0, score);
  }

  private generateSecurityRecommendations(vulnerabilities: any[]): string[] {
    const recommendations = ['Enable automatic security updates'];
    
    if (vulnerabilities.some(v => v.severity === 'critical')) {
      recommendations.push('Isolate device until critical vulnerabilities are patched');
    }
    
    return recommendations;
  }

  private async getLatestFirmwareVersion(deviceType: string): Promise<string> {
    // Get latest firmware version for device type
    return '2.1.0';
  }

  private async performFirmwareUpdate(device: IoTDevice, version: string): Promise<void> {
    // Simulate firmware update process
    console.log(`Updating firmware for device ${device.id} to version ${version}`);
    
    // Simulate update time
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}