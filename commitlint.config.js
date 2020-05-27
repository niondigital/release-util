module.exports = {
	extends: ['@commitlint/config-conventional', 'cz'],
	rules: {
		'header-max-length': [2, 'always', 82]
	}
};
