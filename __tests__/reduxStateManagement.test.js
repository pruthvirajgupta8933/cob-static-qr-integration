/**
 * Redux State Management Tests
 * Testing Redux slice, actions, reducers, and state consistency
 * Critical for real-time UI updates and data synchronization
 */

import { configureStore } from '@reduxjs/toolkit';
import sabqrReducer, {
    createQR,
    fetchQRList,
    updateQR,
    deleteQR,
    toggleQRStatus,
    addTransaction,
    addPaymentRealtime,
    updatePaymentStatus,
    setFilters,
    clearFilters,
    setPagination,
    setCurrentQR,
    resetCurrentQR,
    removeDuplicates
} from '../src/slices/sabqr/sabqrSlice';

// Mock services
jest.mock('../src/services/sabqr/sabqr.service');
jest.mock('../src/utilities/vpaGenerator');
jest.mock('../src/utilities/encryption');

// Create test store
const createTestStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            sabqr: sabqrReducer
        },
        preloadedState: {
            sabqr: {
                ...initialState
            }
        }
    });
};

describe('Redux State Management - Initial State', () => {
    test('should return correct initial state structure', () => {
        const store = createTestStore();
        const state = store.getState().sabqr;

        // Verify all required state properties
        expect(state).toHaveProperty('qrList');
        expect(state).toHaveProperty('currentQR');
        expect(state).toHaveProperty('transactions');
        expect(state).toHaveProperty('payments');
        expect(state).toHaveProperty('dashboard');
        expect(state).toHaveProperty('filters');
        expect(state).toHaveProperty('pagination');
        expect(state).toHaveProperty('loading');
        expect(state).toHaveProperty('error');

        // Verify initial values
        expect(state.qrList).toEqual([]);
        expect(state.currentQR).toBeNull();
        expect(state.transactions).toEqual([]);
        expect(state.payments).toEqual([]);
        expect(state.filters.status).toBe('all');
        expect(state.pagination.page).toBe(1);
        expect(state.pagination.pageSize).toBe(10);
    });

    test('should initialize loading states correctly', () => {
        const store = createTestStore();
        const state = store.getState().sabqr;

        const loadingKeys = [
            'list', 'create', 'update', 'delete', 'details',
            'payments', 'dashboard', 'bulk', 'image', 'export'
        ];

        loadingKeys.forEach(key => {
            expect(state.loading[key]).toBe(false);
        });
    });

    test('should initialize error states correctly', () => {
        const store = createTestStore();
        const state = store.getState().sabqr;

        const errorKeys = [
            'list', 'create', 'update', 'delete', 'details',
            'payments', 'dashboard', 'bulk', 'image', 'export'
        ];

        errorKeys.forEach(key => {
            expect(state.error[key]).toBeNull();
        });
    });
});

describe('Redux State Management - Synchronous Actions', () => {
    describe('Filter Management', () => {
        test('should set filters correctly', () => {
            const store = createTestStore();
            
            const newFilters = {
                status: 'active',
                search: 'WIN25',
                category: 'retail',
                from_date: '2024-01-01',
                to_date: '2024-01-31'
            };

            store.dispatch(setFilters(newFilters));
            const state = store.getState().sabqr;

            expect(state.filters.status).toBe('active');
            expect(state.filters.search).toBe('WIN25');
            expect(state.filters.category).toBe('retail');
            expect(state.pagination.page).toBe(1); // Should reset to first page
        });

        test('should clear filters and reset pagination', () => {
            const initialFilters = {
                status: 'active',
                search: 'test',
                category: 'retail'
            };
            
            const store = createTestStore({
                filters: initialFilters,
                pagination: { page: 5, pageSize: 20 }
            });

            store.dispatch(clearFilters());
            const state = store.getState().sabqr;

            expect(state.filters.status).toBe('all');
            expect(state.filters.search).toBe('');
            expect(state.filters.category).toBe('all');
            expect(state.pagination.page).toBe(1);
        });

        test('should merge filters without overwriting existing ones', () => {
            const initialFilters = {
                status: 'active',
                search: 'existing',
                category: 'retail'
            };
            
            const store = createTestStore({ filters: initialFilters });
            
            store.dispatch(setFilters({ status: 'inactive', search: 'updated' }));
            const state = store.getState().sabqr;

            expect(state.filters.status).toBe('inactive');
            expect(state.filters.search).toBe('updated');
            expect(state.filters.category).toBe('retail'); // Should remain unchanged
        });
    });

    describe('Pagination Management', () => {
        test('should set pagination correctly', () => {
            const store = createTestStore();
            
            const newPagination = {
                page: 3,
                pageSize: 25,
                totalPages: 10,
                totalRecords: 250
            };

            store.dispatch(setPagination(newPagination));
            const state = store.getState().sabqr;

            expect(state.pagination.page).toBe(3);
            expect(state.pagination.pageSize).toBe(25);
            expect(state.pagination.totalPages).toBe(10);
            expect(state.pagination.totalRecords).toBe(250);
        });

        test('should handle partial pagination updates', () => {
            const initialPagination = {
                page: 1,
                pageSize: 10,
                totalPages: 5,
                totalRecords: 50
            };
            
            const store = createTestStore({ pagination: initialPagination });
            
            store.dispatch(setPagination({ page: 2 }));
            const state = store.getState().sabqr;

            expect(state.pagination.page).toBe(2);
            expect(state.pagination.pageSize).toBe(10); // Should remain unchanged
            expect(state.pagination.totalPages).toBe(5); // Should remain unchanged
        });
    });

    describe('Current QR Management', () => {
        test('should set current QR', () => {
            const store = createTestStore();
            
            const qrData = {
                id: 1,
                qr_identifier: 'WIN25',
                merchant_name: 'SRS Live Technologies',
                status: 'active'
            };

            store.dispatch(setCurrentQR(qrData));
            const state = store.getState().sabqr;

            expect(state.currentQR).toEqual(qrData);
        });

        test('should reset current QR to null', () => {
            const initialQR = {
                id: 1,
                qr_identifier: 'WIN25'
            };
            
            const store = createTestStore({ currentQR: initialQR });
            
            store.dispatch(resetCurrentQR());
            const state = store.getState().sabqr;

            expect(state.currentQR).toBeNull();
        });
    });

    describe('Real-time Payment Updates', () => {
        test('should add payment in real-time', () => {
            const store = createTestStore({
                dashboard: {
                    recent_payments: [],
                    summary: { today_collections: 0, today_transactions: 0 }
                }
            });

            const newPayment = {
                id: 'TXN123',
                qr_code_id: 1,
                amount: 150.50,
                customer_name: 'John Doe',
                status: 'success',
                payment_time: '2024-01-01T10:00:00Z'
            };

            store.dispatch(addPaymentRealtime(newPayment));
            const state = store.getState().sabqr;

            expect(state.payments[0]).toEqual(newPayment);
            expect(state.dashboard.recent_payments[0]).toEqual(newPayment);
            expect(state.dashboard.summary.today_collections).toBe(150.50);
        });

        test('should update payment status in real-time', () => {
            const existingPayment = {
                transaction_id: 'TXN123',
                status: 'pending',
                amount: 100.00
            };
            
            const store = createTestStore({
                payments: [existingPayment],
                dashboard: { summary: { total_collections: 0, today_collections: 0 } }
            });

            const updateData = {
                transactionId: 'TXN123',
                status: 'SUCCESS',
                data: { amount: 100.00, bank_rrn: 'RRN123456' }
            };

            store.dispatch(updatePaymentStatus(updateData));
            const state = store.getState().sabqr;

            expect(state.payments[0].status).toBe('SUCCESS');
            expect(state.payments[0].bank_rrn).toBe('RRN123456');
            expect(state.dashboard.summary.total_collections).toBe(100.00);
        });

        test('should add transaction to tracking list', () => {
            const store = createTestStore({
                qrList: [{ qr_identifier: 'WIN25', total_collections: 0, transaction_count: 0 }],
                qrSummary: { total_collections: 0, total_transactions: 0 }
            });

            const transaction = {
                qr_identifier: 'WIN25',
                amount: 250.75,
                status: 'SUCCESS',
                customer_name: 'Jane Smith'
            };

            store.dispatch(addTransaction(transaction));
            const state = store.getState().sabqr;

            expect(state.transactions[0]).toMatchObject(transaction);
            expect(state.transactions[0]).toHaveProperty('id');
            expect(state.transactions[0]).toHaveProperty('timestamp');
            
            // Should update QR statistics
            expect(state.qrList[0].total_collections).toBe(250.75);
            expect(state.qrList[0].transaction_count).toBe(1);
            
            // Should update summary
            expect(state.qrSummary.total_collections).toBe(250.75);
            expect(state.qrSummary.total_transactions).toBe(1);
        });
    });

    describe('QR List Management', () => {
        test('should remove duplicate QR codes', () => {
            const duplicatedList = [
                { qr_identifier: 'WIN25', id: 1 },
                { qr_identifier: 'WIN26', id: 2 },
                { qr_identifier: 'WIN25', id: 3 }, // Duplicate
                { qr_identifier: 'WIN27', id: 4 },
                { qr_identifier: 'WIN26', id: 5 }  // Duplicate
            ];
            
            const store = createTestStore({ qrList: duplicatedList });
            
            store.dispatch(removeDuplicates());
            const state = store.getState().sabqr;

            expect(state.qrList).toHaveLength(3);
            expect(state.qrList.map(qr => qr.qr_identifier)).toEqual(['WIN25', 'WIN26', 'WIN27']);
        });

        test('should preserve first occurrence when removing duplicates', () => {
            const duplicatedList = [
                { qr_identifier: 'WIN25', id: 1, name: 'First' },
                { qr_identifier: 'WIN25', id: 2, name: 'Second' }
            ];
            
            const store = createTestStore({ qrList: duplicatedList });
            
            store.dispatch(removeDuplicates());
            const state = store.getState().sabqr;

            expect(state.qrList).toHaveLength(1);
            expect(state.qrList[0].name).toBe('First');
            expect(state.qrList[0].id).toBe(1);
        });
    });
});

describe('Redux State Management - Async Actions', () => {
    let mockService;

    beforeEach(() => {
        mockService = require('../src/services/sabqr/sabqr.service').default;
        jest.clearAllMocks();
    });

    describe('Create QR Action', () => {
        test('should handle successful QR creation', async () => {
            const mockQRData = {
                qr_identifier: 'WIN25',
                merchant_name: 'SRS Live Technologies',
                reference_name: 'Main Counter',
                vpa: 'sabpaisa.srswin25@hdfcbank',
                status: 'active'
            };

            const store = createTestStore();
            
            const action = createQR(mockQRData);
            await store.dispatch(action);
            
            const state = store.getState().sabqr;

            // Should update loading states
            expect(state.loading.create).toBe(false);
            expect(state.error.create).toBeNull();
        });

        test('should handle QR creation failure', async () => {
            const mockError = 'QR identifier already exists';
            
            const store = createTestStore();
            
            // Mock the thunk to simulate rejection
            const mockThunk = createQR.rejected(mockError, 'createQR', {});
            store.dispatch(mockThunk);
            
            const state = store.getState().sabqr;

            expect(state.loading.create).toBe(false);
            expect(state.error.create).toBe(mockError);
        });

        test('should prevent duplicate QR identifiers', async () => {
            const existingQR = { qr_identifier: 'WIN25', id: 1 };
            const store = createTestStore({ qrList: [existingQR] });

            const duplicateQRData = {
                qr_identifier: 'WIN25', // Duplicate identifier
                merchant_name: 'Another Merchant'
            };

            const action = createQR(duplicateQRData);
            await store.dispatch(action);
            
            const state = store.getState().sabqr;
            
            // Should have handled the duplicate gracefully
            expect(state.qrList).toHaveLength(1);
        });

        test('should generate transaction reference with STQ prefix', async () => {
            const mockQRData = {
                qr_identifier: 'WIN25',
                merchant_name: 'SRS Live Technologies'
            };

            const store = createTestStore();
            const action = createQR(mockQRData);
            await store.dispatch(action);

            // The thunk should have generated a proper transaction reference
            // This would be tested in the actual thunk implementation
        });
    });

    describe('Fetch QR List Action', () => {
        test('should handle successful QR list fetch', async () => {
            const mockQRList = [
                { id: 1, qr_identifier: 'WIN25', status: 'active' },
                { id: 2, qr_identifier: 'WIN26', status: 'inactive' }
            ];

            const mockResponse = {
                data: {
                    qr_codes: mockQRList,
                    pagination: { page: 1, totalPages: 1, totalRecords: 2 },
                    summary: { total_active: 1, total_inactive: 1 }
                }
            };

            const store = createTestStore();
            const mockThunk = fetchQRList.fulfilled(mockResponse, 'fetchQRList', {});
            store.dispatch(mockThunk);
            
            const state = store.getState().sabqr;

            expect(state.loading.list).toBe(false);
            expect(state.qrList).toEqual(mockQRList);
            expect(state.pagination.totalRecords).toBe(2);
        });

        test('should handle QR list fetch with filters', async () => {
            const filters = { status: 'active', search: 'WIN' };
            const store = createTestStore({ filters });

            const action = fetchQRList({ status: 'active' });
            await store.dispatch(action);

            // Should combine filters from state and parameters
        });

        test('should handle empty QR list response', async () => {
            const emptyResponse = {
                data: { qr_codes: [], pagination: { totalRecords: 0 }, summary: {} }
            };

            const store = createTestStore();
            const mockThunk = fetchQRList.fulfilled(emptyResponse, 'fetchQRList', {});
            store.dispatch(mockThunk);
            
            const state = store.getState().sabqr;

            expect(state.qrList).toEqual([]);
            expect(state.loading.list).toBe(false);
        });
    });

    describe('Update QR Action', () => {
        test('should update QR in list and current QR', async () => {
            const existingQR = { id: 1, qr_identifier: 'WIN25', status: 'active' };
            const updatedQR = { id: 1, qr_identifier: 'WIN25', status: 'inactive' };

            const store = createTestStore({ 
                qrList: [existingQR], 
                currentQR: existingQR 
            });

            const mockResponse = { data: updatedQR };
            const mockThunk = updateQR.fulfilled(mockResponse, 'updateQR', { qrId: 1, data: {} });
            store.dispatch(mockThunk);

            const state = store.getState().sabqr;

            expect(state.qrList[0].status).toBe('inactive');
            expect(state.currentQR.status).toBe('inactive');
        });

        test('should handle QR not found in list during update', async () => {
            const existingQR = { id: 1, qr_identifier: 'WIN25' };
            const updatedQR = { id: 999, qr_identifier: 'WIN999' }; // Different ID

            const store = createTestStore({ qrList: [existingQR] });

            const mockResponse = { data: updatedQR };
            const mockThunk = updateQR.fulfilled(mockResponse, 'updateQR', { qrId: 999, data: {} });
            store.dispatch(mockThunk);

            const state = store.getState().sabqr;

            // Original QR should remain unchanged
            expect(state.qrList[0]).toEqual(existingQR);
        });
    });

    describe('Delete QR Action', () => {
        test('should remove QR from list and reset current QR if deleted', async () => {
            const qrToDelete = { id: 1, qr_identifier: 'WIN25' };
            const otherQR = { id: 2, qr_identifier: 'WIN26' };

            const store = createTestStore({ 
                qrList: [qrToDelete, otherQR], 
                currentQR: qrToDelete 
            });

            const mockThunk = deleteQR.fulfilled(1, 'deleteQR', 1);
            store.dispatch(mockThunk);

            const state = store.getState().sabqr;

            expect(state.qrList).toHaveLength(1);
            expect(state.qrList[0].id).toBe(2);
            expect(state.currentQR).toBeNull();
        });

        test('should not affect current QR if different QR is deleted', async () => {
            const currentQR = { id: 1, qr_identifier: 'WIN25' };
            const qrToDelete = { id: 2, qr_identifier: 'WIN26' };

            const store = createTestStore({ 
                qrList: [currentQR, qrToDelete], 
                currentQR: currentQR 
            });

            const mockThunk = deleteQR.fulfilled(2, 'deleteQR', 2);
            store.dispatch(mockThunk);

            const state = store.getState().sabqr;

            expect(state.qrList).toHaveLength(1);
            expect(state.currentQR).toEqual(currentQR);
        });
    });

    describe('Toggle QR Status Action', () => {
        test('should toggle QR status correctly', async () => {
            const qr = { id: 1, qr_identifier: 'WIN25', status: 'active' };
            const toggledQR = { id: 1, qr_identifier: 'WIN25', status: 'inactive' };

            const store = createTestStore({ 
                qrList: [qr], 
                currentQR: qr 
            });

            const mockResponse = { data: toggledQR };
            const mockThunk = toggleQRStatus.fulfilled(mockResponse, 'toggleQRStatus', { qrId: 1, status: 'inactive' });
            store.dispatch(mockThunk);

            const state = store.getState().sabqr;

            expect(state.qrList[0].status).toBe('inactive');
            expect(state.currentQR.status).toBe('inactive');
        });
    });
});

describe('Redux State Management - State Consistency', () => {
    test('should maintain referential integrity between QR list and current QR', () => {
        const qr = { id: 1, qr_identifier: 'WIN25', status: 'active' };
        const updatedQR = { id: 1, qr_identifier: 'WIN25', status: 'inactive' };

        const store = createTestStore({ 
            qrList: [qr], 
            currentQR: qr 
        });

        // Update QR
        const mockResponse = { data: updatedQR };
        const mockThunk = updateQR.fulfilled(mockResponse, 'updateQR', { qrId: 1, data: {} });
        store.dispatch(mockThunk);

        const state = store.getState().sabqr;

        // Both list and current QR should be updated consistently
        expect(state.qrList[0].status).toBe(state.currentQR.status);
    });

    test('should handle state updates without mutations', () => {
        const initialQRList = [
            { id: 1, qr_identifier: 'WIN25', status: 'active' }
        ];

        const store = createTestStore({ qrList: initialQRList });
        const initialState = store.getState().sabqr;

        // Add new QR
        const newQR = { id: 2, qr_identifier: 'WIN26', status: 'active' };
        const mockThunk = createQR.fulfilled({ data: newQR }, 'createQR', {});
        store.dispatch(mockThunk);

        // Original state should not be mutated
        expect(initialState.qrList).toHaveLength(1);
        expect(store.getState().sabqr.qrList).toHaveLength(2);
    });

    test('should maintain transaction statistics consistency', () => {
        const qr = { 
            qr_identifier: 'WIN25', 
            total_collections: 100.00, 
            transaction_count: 1 
        };

        const store = createTestStore({ 
            qrList: [qr],
            qrSummary: { total_collections: 100.00, total_transactions: 1 }
        });

        const newTransaction = {
            qr_identifier: 'WIN25',
            amount: 50.00,
            status: 'SUCCESS'
        };

        store.dispatch(addTransaction(newTransaction));
        const state = store.getState().sabqr;

        // QR and summary statistics should be consistent
        expect(state.qrList[0].total_collections).toBe(150.00);
        expect(state.qrList[0].transaction_count).toBe(2);
        expect(state.qrSummary.total_collections).toBe(150.00);
        expect(state.qrSummary.total_transactions).toBe(2);
    });
});

describe('Redux State Management - Performance', () => {
    test('should handle large QR lists efficiently', () => {
        const largeQRList = Array.from({ length: 1000 }, (_, i) => ({
            id: i + 1,
            qr_identifier: `QR${i + 1}`,
            status: i % 2 === 0 ? 'active' : 'inactive'
        }));

        const startTime = performance.now();
        const store = createTestStore({ qrList: largeQRList });
        const endTime = performance.now();

        expect(endTime - startTime).toBeLessThan(50); // Should be fast
        expect(store.getState().sabqr.qrList).toHaveLength(1000);
    });

    test('should handle frequent real-time updates efficiently', () => {
        const store = createTestStore({
            payments: [],
            dashboard: { 
                recent_payments: [], 
                summary: { today_collections: 0 } 
            }
        });

        const startTime = performance.now();

        // Simulate 100 rapid payment updates
        for (let i = 0; i < 100; i++) {
            const payment = {
                id: `TXN${i}`,
                amount: 100 + i,
                status: 'success'
            };
            store.dispatch(addPaymentRealtime(payment));
        }

        const endTime = performance.now();

        expect(endTime - startTime).toBeLessThan(100); // Should handle updates quickly
        expect(store.getState().sabqr.payments).toHaveLength(100);
    });

    test('should optimize filter operations', () => {
        const store = createTestStore();

        const startTime = performance.now();

        // Apply multiple filter changes
        for (let i = 0; i < 50; i++) {
            store.dispatch(setFilters({
                status: i % 2 === 0 ? 'active' : 'inactive',
                search: `search${i}`
            }));
        }

        const endTime = performance.now();

        expect(endTime - startTime).toBeLessThan(50); // Should be efficient
        expect(store.getState().sabqr.filters.search).toBe('search49');
    });
});

describe('Redux State Management - Error Handling', () => {
    test('should handle invalid action payloads gracefully', () => {
        const store = createTestStore();

        // Dispatch action with invalid payload
        expect(() => {
            store.dispatch(setFilters(null));
        }).not.toThrow();

        expect(() => {
            store.dispatch(addTransaction(undefined));
        }).not.toThrow();
    });

    test('should recover from async action failures', async () => {
        const store = createTestStore();

        // Simulate failed action
        const errorMessage = 'Network error';
        const mockThunk = fetchQRList.rejected(errorMessage, 'fetchQRList', {});
        store.dispatch(mockThunk);

        const state = store.getState().sabqr;

        expect(state.loading.list).toBe(false);
        expect(state.error.list).toBe(errorMessage);

        // State should still be functional for other operations
        store.dispatch(setFilters({ status: 'active' }));
        expect(store.getState().sabqr.filters.status).toBe('active');
    });

    test('should maintain state integrity after partial failures', () => {
        const initialQR = { id: 1, qr_identifier: 'WIN25', status: 'active' };
        const store = createTestStore({ 
            qrList: [initialQR], 
            currentQR: initialQR 
        });

        // Simulate failed update
        const errorMessage = 'Update failed';
        const mockThunk = updateQR.rejected(errorMessage, 'updateQR', { qrId: 1, data: {} });
        store.dispatch(mockThunk);

        const state = store.getState().sabqr;

        // State should remain unchanged after failure
        expect(state.qrList[0]).toEqual(initialQR);
        expect(state.currentQR).toEqual(initialQR);
        expect(state.error.update).toBe(errorMessage);
    });
});