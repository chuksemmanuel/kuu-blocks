document.addEventListener('alpine:init', () => {
	const Alpine = window.Alpine;
	const Prism = window.Prism;
	const md = window.markdownit({
		html: true,
		linkify: true,
		typographer: true,
		breaks: true,
		highlight: (code, lang) => {
			console.log(lang);
			if (Prism.languages[lang]) {
				return Prism.highlight(code, Prism.languages[lang], lang);
			} else {
				console.log('No language found for ' + lang);
				return '';
			}
		},
	});

	Alpine.data('markdown', function () {
		return {
			html: '',
			init() {
				this.html = md.render(this.$el.textContent);
			},
		};
	});
});

/**
 * Link for Prism selection
 *
 * https://prismjs.com/download#themes=prism&languages=markup+css+clike+javascript+bash+docker+graphql+json+liquid+markdown+markup-templating+toml+typescript&plugins=line-numbers+show-language+autoloader+toolbar+copy-to-clipboard+download-button
 */
