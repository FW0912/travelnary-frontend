import { Injectable } from "@angular/core";
import { LocalStorageService } from "../local-storage/local-storage.service";

interface Cached<T> {
	data: T;
	cachedAt: number;
	ttl: number | null;
}

@Injectable({
	providedIn: "root",
})
export class CacheService {
	private readonly CACHE_KEY = "TRAVELNARY-V1-CACHE";
	private readonly defaultTTL: number = 1000 * 60 * 60 * 24; // 1 day

	private memoryCache = new Map<string, Cached<any>>();

	constructor(private localStorageService: LocalStorageService) {
		this.hydrate();
	}

	private hydrate() {
		const cache = this.localStorageService.getItem<
			Record<string, Cached<any>>
		>(this.CACHE_KEY);

		if (!cache) {
			return;
		}

		try {
			Object.entries(cache).forEach(([key, value]) => {
				if (!this.isExpired(value)) {
					this.memoryCache.set(key, value);
				}
			});
		} catch (e) {
			console.log(e);
			this.localStorageService.removeItem(this.CACHE_KEY);
		}
	}

	private persist() {
		const obj = Object.fromEntries(this.memoryCache);
		this.localStorageService.setItem(this.CACHE_KEY, JSON.stringify(obj));
	}

	private isExpired(entry: Cached<any>) {
		if (entry.ttl === null) {
			return false;
		}

		return Date.now() - entry.cachedAt > entry.ttl;
	}

	public get<T>(key: string): T | null {
		const entry = this.memoryCache.get(key);

		if (!entry) {
			return null;
		}

		if (this.isExpired(entry)) {
			this.memoryCache.delete(key);
			this.persist();
			return null;
		}

		return entry.data;
	}

	public has(key: string): boolean {
		return this.memoryCache.has(key);
	}

	public set(key: string, value: any) {
		this.memoryCache.set(key, {
			data: value,
			cachedAt: Date.now(),
			ttl: null,
		});
		this.persist();
	}

	public setWithTtl(key: string, value: any, ttl: number = this.defaultTTL) {
		this.memoryCache.set(key, {
			data: value,
			cachedAt: Date.now(),
			ttl: ttl,
		});
		this.persist();
	}
}
