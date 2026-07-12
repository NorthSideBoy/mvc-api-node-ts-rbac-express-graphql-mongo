export const schemaOptions = {
	timestamps: true,
	toJSON: {
		virtuals: true,
		getters: true,
	},
	toObject: {
		virtuals: true,
		getters: true,
	},
} as const;
