import type {
  UserProfile,
  DeviceInfo,
  HealthTelemetry,
  RiskAssessment,
  AlertRecord,
  EmergencyContact,
  EmergencyEvent,
  ManagerUserAssignment
} from '../../types';

const DB_NAME = 'heatguard_edge_db';
const DB_VERSION = 2;

// Relational tables definitions
export interface DBStore {
  users: UserProfile & { passwordHash: string };
  devices: DeviceInfo;
  health_data: HealthTelemetry;
  risk_assessments: RiskAssessment;
  alerts: AlertRecord;
  emergency_contacts: EmergencyContact;
  emergency_events: EmergencyEvent;
  manager_user_assignments: ManagerUserAssignment;
}

class RelationalDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('IndexedDB not available, fallback to memory');
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users table
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('role', 'role', { unique: false });
        }

        // Devices table
        if (!db.objectStoreNames.contains('devices')) {
          const devStore = db.createObjectStore('devices', { keyPath: 'id' });
          devStore.createIndex('userId', 'userId', { unique: true });
        }

        // Health Telemetry table
        if (!db.objectStoreNames.contains('health_data')) {
          const healthStore = db.createObjectStore('health_data', { keyPath: 'id' });
          healthStore.createIndex('userId', 'userId', { unique: false });
          healthStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Risk Assessments table
        if (!db.objectStoreNames.contains('risk_assessments')) {
          const riskStore = db.createObjectStore('risk_assessments', { keyPath: 'id' });
          riskStore.createIndex('userId', 'userId', { unique: false });
          riskStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Alerts table
        if (!db.objectStoreNames.contains('alerts')) {
          const alertStore = db.createObjectStore('alerts', { keyPath: 'id' });
          alertStore.createIndex('userId', 'userId', { unique: false });
          alertStore.createIndex('severity', 'severity', { unique: false });
          alertStore.createIndex('read', 'read', { unique: false });
        }

        // Emergency Contacts table
        if (!db.objectStoreNames.contains('emergency_contacts')) {
          const ecStore = db.createObjectStore('emergency_contacts', { keyPath: 'id' });
          ecStore.createIndex('userId', 'userId', { unique: false });
        }

        // Emergency Events table
        if (!db.objectStoreNames.contains('emergency_events')) {
          const eeStore = db.createObjectStore('emergency_events', { keyPath: 'id' });
          eeStore.createIndex('userId', 'userId', { unique: false });
          eeStore.createIndex('status', 'status', { unique: false });
        }

        // Manager User Assignments table
        if (!db.objectStoreNames.contains('manager_user_assignments')) {
          const muaStore = db.createObjectStore('manager_user_assignments', { keyPath: 'id' });
          muaStore.createIndex('managerId', 'managerId', { unique: false });
          muaStore.createIndex('userId', 'userId', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (e) => {
        console.error('IndexedDB open error:', e);
        reject(e);
      };
    });

    return this.dbPromise;
  }

  // Generic getAll
  public async getAll<K extends keyof DBStore>(storeName: K): Promise<DBStore[K][]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // Generic getById
  public async getById<K extends keyof DBStore>(storeName: K, id: string): Promise<DBStore[K] | undefined> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  // Query by index
  public async getByIndex<K extends keyof DBStore>(
    storeName: K,
    indexName: string,
    value: IDBValidKey
  ): Promise<DBStore[K][]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const req = index.getAll(value);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // Generic put (insert / update)
  public async put<K extends keyof DBStore>(storeName: K, value: DBStore[K]): Promise<DBStore[K]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve(value);
      req.onerror = () => reject(req.error);
    });
  }

  // Generic delete
  public async delete<K extends keyof DBStore>(storeName: K, id: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Generic clear table
  public async clear<K extends keyof DBStore>(storeName: K): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const db = new RelationalDatabase();
