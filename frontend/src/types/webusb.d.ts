/** Minimal WebUSB types for Thai ID card reader (browser-only). */
interface USBDevice {
  configuration: USBConfiguration | null;
  open(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
  transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
  transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
  releaseInterface(interfaceNumber: number): Promise<void>;
  close(): Promise<void>;
}

interface USBConfiguration {
  interfaces: USBInterface[];
}

interface USBInterface {
  alternates: USBAlternateInterface[];
}

interface USBAlternateInterface {
  endpoints: USBEndpoint[];
}

interface USBEndpoint {
  direction: 'in' | 'out';
  endpointNumber: number;
}

interface USBInTransferResult {
  data?: DataView;
  status: string;
}

interface USBOutTransferResult {
  status: string;
}

interface Navigator {
  usb: {
    requestDevice(options: { filters: Array<{ vendorId?: number }> }): Promise<USBDevice>;
  };
}
