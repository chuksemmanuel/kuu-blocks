

document.addEventListener('alpine:init', () => {

    const Alpine = window.Alpine
    Alpine.store('theme', {
        darkMode: false
    })


    console.log('Alpine theme store initialized')
})