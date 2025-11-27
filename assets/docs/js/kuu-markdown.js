document.addEventListener('alpine:init', () => {
	const Alpine = window.Alpine;

	Alpine.data('markdown', function () {
		return {
			html: '',
			init() {
				const Prism = window.Prism;
				if (!window.markdownit) {
					console.error('Markdown-it is not loaded');
					return;
				}
				const md = window.markdownit({
					linkify: true,
					typographer: true,
					breaks: true,
					highlight: (code, lang) => {
						if (!Prism) {
							console.error('Prism is not loaded');
							return '';
						}
						if (Prism.languages[lang]) {
							return Prism.highlight(code, Prism.languages[lang], lang);
						} else {
							console.log('Prism:No language found for ' + lang);
							return '';
						}
					},
				});
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
