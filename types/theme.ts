export type Theme = {
	cartDrawer: {
		open: () => void;
		close: () => void;
		refresh: () => Promise<void>;
	};
};
