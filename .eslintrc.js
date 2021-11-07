module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "prettier"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
	],
	rules: {
		"@typescript-eslint/explicit-function-return-type": "error",
		"@typescript-eslint/no-explicit-any": "error",
	},
};
