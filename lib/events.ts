type Listener = () => void;

class SimpleEventEmitter {
    private listeners: Record<string, Listener[]> = {};

    on(event: string, callback: Listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: Listener) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event: string) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback());
    }
}

export const events = new SimpleEventEmitter();

export const EVENTS = {
    ONBOARDING_UPDATED: 'onboarding_updated',
    DATA_CLEARED: 'data_cleared',
    CONCEPTS_UPDATED: 'concepts_updated',
};
