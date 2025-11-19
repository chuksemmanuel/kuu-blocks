declare global {
	type getContrastRatio = (color1: string, color2: string) => number;
	type getContrastColor = (hexColor: string) => string;
}

export {};
