/**
 * @file types.ts
 * @description Enterprise TypeScript models and interfaces for Asset Management,
 * Hardware Inventory, Lifecycle Tracking, Employee Allocations, and Maintenance Records.
 */

export type AssetStatus = 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'RETIRED';

export type AssetCategory =
  | 'LAPTOP'
  | 'DESKTOP'
  | 'MOBILE'
  | 'MONITOR'
  | 'PERIPHERAL'
  | 'SERVER'
  | 'NETWORKING'
  | 'FURNITURE'
  | 'OTHER';

export interface AssetAllocation {
  id: string;
  assetId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail?: string;
  department?: string;
  assignedDate: string;
  returnDate?: string;
  conditionOnAssign?: string;
  conditionOnReturn?: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  issueDescription: string;
  startDate: string;
  completionDate?: string;
  cost?: number;
  vendor?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface AssetCurrentHolder {
  employeeId: string;
  name: string;
  email?: string;
  department?: string;
  assignedDate?: string;
}

export interface Asset {
  id: string;
  assetName: string;
  assetTag: string; // e.g. OFC-AST-1042
  serialNumber: string;
  category: AssetCategory;
  status: AssetStatus;
  purchaseDate: string;
  cost: number;
  currency?: string;
  warrantyExpiry?: string;
  vendor?: string;
  location?: string;
  specifications?: Record<string, string>;
  currentHolder?: AssetCurrentHolder | null;
  allocations?: AssetAllocation[];
  maintenanceRecords?: MaintenanceRecord[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssetStats {
  totalAssets: number;
  allocated: number;
  available: number;
  underMaintenance: number;
  retired?: number;
  totalValue?: number;
  currency?: string;
}

export interface CreateAssetPayload {
  assetName: string;
  assetTag: string;
  serialNumber: string;
  category: AssetCategory;
  purchaseDate: string;
  cost: number;
  currency?: string;
  warrantyExpiry?: string;
  vendor?: string;
  location?: string;
  notes?: string;
}

export interface UpdateAssetPayload extends Partial<CreateAssetPayload> {
  id: string;
  status?: AssetStatus;
}

export interface AssignAssetPayload {
  assetId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail?: string;
  department?: string;
  assignedDate?: string;
  condition?: string;
  notes?: string;
}

export interface ReturnAssetPayload {
  assetId: string;
  returnDate?: string;
  condition?: string;
  notes?: string;
}

export interface MarkMaintenancePayload {
  assetId: string;
  issueDescription: string;
  vendor?: string;
  estimatedCost?: number;
  notes?: string;
}

export interface AssetListFilters {
  search?: string;
  category?: AssetCategory | 'ALL';
  status?: AssetStatus | 'ALL';
  page?: number;
  limit?: number;
}

export interface AssetListResponse {
  items: Asset[];
  total: number;
  page: number;
  limit: number;
  stats?: AssetStats;
}
