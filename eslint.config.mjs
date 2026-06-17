export default [
  {
    ignores: ["node_modules/**", "**/swiper-bundle.min.js", "**/jquery-*.js"]
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Swiper: "readonly",
        $: "readonly",
        jQuery: "readonly",
        Image: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        readCart: "readonly",
        alert: "readonly",
        location: "readonly",
        FormData: "readonly",
        URLSearchParams: "readonly",
        createRecommendLists: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn"
    }
  }
];
