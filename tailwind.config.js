/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: '#0D9488', // Teal 600
                secondary: '#C2410C', // Orange 700
                background: '#F8FAFC', // Slate 50
            }
        },
    },
    plugins: [],
}


