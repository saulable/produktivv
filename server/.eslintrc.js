module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true
	},
	extends: 'eslint:recommended',
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module',
		allowImportExportEverywhere: false,
		codeFrame: false
	},
	plugins: ['react'],
	rules: {
		indent: ['error', 'tab'],
		'no-unused-vars': 0,
		'no-console': 0,
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		globals: {
			__: false
		}
	}
};
