import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink:'#182230', muted:'#738092', brand:'#6558e8', canvas:'#f6f7fb' }, boxShadow: { soft:'0 10px 35px rgba(27,39,67,.07)' } } }, plugins: [] };
export default config;
