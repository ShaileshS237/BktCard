/**
 * LocalStorage-backed data service for Buckets and Cards.
 * Structure:
 * - DATA_KEY: Array<{ id:number, name:string, cards:Array<{ id:number, name:string, description:string }> }>
 */

const DATA_KEY = "bkt_data";

// Internal utils
function ensureInit() {
    if (localStorage.getItem(DATA_KEY) === null) {
        localStorage.setItem(DATA_KEY, JSON.stringify([]));
    }
}

function read(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Simple pub-sub so UI can react to localStorage changes within the same tab
const listeners = new Set();

export function subscribe(fn) {
    if (typeof fn === "function") {
        listeners.add(fn);
        return () => listeners.delete(fn);
    }
    return () => { };
}

function notify() {
    listeners.forEach((fn) => {
        try {
            fn();
        } catch { }
    });
}

function maxId(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return Math.max(
        ...arr.map((x) => {
            const n = Number(x?.id);
            return Number.isFinite(n) ? n : 0;
        })
    );
}

// Public API

export function getBuckets() {
    ensureInit();
    // Read current data
    const data = read(DATA_KEY, []);

    // Migration: videoLink -> description (one-time, idempotent)
    let changed = false;
    const migrated = Array.isArray(data)
        ? data.map((b) => {
            const cards = Array.isArray(b?.cards)
                ? b.cards.map((c) => {
                    if (
                        c &&
                        typeof c === "object" &&
                        Object.prototype.hasOwnProperty.call(c, "videoLink") &&
                        (c.description === undefined || c.description === "")
                    ) {
                        const { videoLink, ...rest } = c;
                        changed = true;
                        return { ...rest, description: videoLink };
                    }
                    return c;
                })
                : [];
            return { ...b, cards };
        })
        : [];

    if (changed) {
        // Persist migrated data without notifying subscribers to avoid loops during read
        write(DATA_KEY, migrated);
    }

    return migrated;
}

export function saveBuckets(next) {
    write(DATA_KEY, Array.isArray(next) ? next : []);
    notify();
}

export function getBucketById(bucketId) {
    const id = Number(bucketId);
    return getBuckets().find((b) => Number(b?.id) === id);
}

export function getBucketByName(name) {
    if (!name) return undefined;
    return getBuckets().find((b) => b?.name === name);
}

export function addBucket(name) {
    const trimmed = (name || "").trim();
    if (!trimmed) return undefined;

    const buckets = getBuckets();
    // Prevent duplicate names (optional)
    const exists = buckets.some((b) => b?.name === trimmed);
    if (exists) {
        return undefined;
    }

    const nextId = maxId(buckets) + 1;
    const newBucket = { id: nextId, name: trimmed, cards: [] };
    const next = [...buckets, newBucket];
    saveBuckets(next); // will notify
    return newBucket;
}

export function deleteBucket(bucketId) {
    const buckets = getBuckets();
    const id = Number(bucketId);
    const next = buckets.filter((b) => Number(b?.id) !== id);
    if (next.length === buckets.length) return undefined;
    saveBuckets(next);
    return true;
}
export function addCardToBucket(bucketId, card) {
    const buckets = getBuckets();
    const idx = buckets.findIndex((b) => Number(b?.id) === Number(bucketId));
    if (idx === -1) return undefined;

    const bucket = { ...buckets[idx] };
    const cards = Array.isArray(bucket.cards) ? [...bucket.cards] : [];
    const newId = maxId(cards) + 1;
    const newCard = {
        id: newId,
        name: card?.name ?? "",
        description: card?.description ?? "",
    };

    const updatedBucket = { ...bucket, cards: [...cards, newCard] };
    const next = [...buckets];
    next[idx] = updatedBucket;
    saveBuckets(next);
    return updatedBucket;
}

export function deleteCardFromBucket(bucketId, cardId) {
    const buckets = getBuckets();
    const bIdx = buckets.findIndex((b) => Number(b?.id) === Number(bucketId));
    if (bIdx === -1) return undefined;

    const bucket = { ...buckets[bIdx] };
    const cards = Array.isArray(bucket.cards) ? bucket.cards : [];
    const filtered = cards.filter((c) => Number(c?.id) !== Number(cardId));

    const updatedBucket = { ...bucket, cards: filtered };
    const next = [...buckets];
    next[bIdx] = updatedBucket;
    saveBuckets(next);
    return updatedBucket;
}

export function updateCardInBucket(bucketId, cardId, updates) {
    const buckets = getBuckets();
    const bIdx = buckets.findIndex((b) => Number(b?.id) === Number(bucketId));
    if (bIdx === -1) return undefined;

    const bucket = { ...buckets[bIdx] };
    const cards = Array.isArray(bucket.cards) ? [...bucket.cards] : [];
    const cIdx = cards.findIndex((c) => Number(c?.id) === Number(cardId));
    if (cIdx === -1) return undefined;

    const current = cards[cIdx];
    const nextCard = {
        ...current,
        ...(updates || {}),
        id: current.id, // preserve id
    };
    cards[cIdx] = nextCard;

    const updatedBucket = { ...bucket, cards };
    const next = [...buckets];
    next[bIdx] = updatedBucket;
    saveBuckets(next);
    return updatedBucket;
}

export function moveCardToBucketByName(fromBucketId, toBucketName, cardId) {
    const buckets = getBuckets();
    const fromIdx = buckets.findIndex((b) => Number(b?.id) === Number(fromBucketId));
    if (fromIdx === -1) return { fromUpdated: undefined, toUpdated: undefined };

    const fromBucket = { ...buckets[fromIdx] };
    const fromCards = Array.isArray(fromBucket.cards) ? [...fromBucket.cards] : [];

    const card = fromCards.find((c) => Number(c?.id) === Number(cardId));
    if (!card) return { fromUpdated: undefined, toUpdated: undefined };

    // Remove from current
    const newFromCards = fromCards.filter((c) => Number(c?.id) !== Number(cardId));
    const updatedFromBucket = { ...fromBucket, cards: newFromCards };

    // Find destination by name
    const toIdx = buckets.findIndex((b) => b?.name === toBucketName);
    if (toIdx === -1) {
        // write back removal only
        const next = [...buckets];
        next[fromIdx] = updatedFromBucket;
        saveBuckets(next);
        return { fromUpdated: updatedFromBucket, toUpdated: undefined };
    }

    const toBucket = { ...buckets[toIdx] };
    const toCards = Array.isArray(toBucket.cards) ? [...toBucket.cards] : [];
    const newId = maxId(toCards) + 1;
    const cardForDest = {
        id: newId,
        name: card.name,
        description: card.description,
    };
    const updatedToBucket = { ...toBucket, cards: [...toCards, cardForDest] };

    const next = [...buckets];
    next[fromIdx] = updatedFromBucket;
    next[toIdx] = updatedToBucket;
    saveBuckets(next);

    return { fromUpdated: updatedFromBucket, toUpdated: updatedToBucket };
}
